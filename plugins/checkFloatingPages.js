const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const matter = require('gray-matter');

async function checkFloatingPages(context, options = {}) {
    return {
        name: 'check-floating-pages',

        async postBuild({ siteConfig, routesPaths, outDir, head }) {
            const { baseUrl } = siteConfig;
            const docsDir = path.resolve(context.siteDir, 'docs');

            // Read exceptions file if provided
            let exceptions = [];
            if (options.exceptionsFile && fs.existsSync(options.exceptionsFile)) {
                try {
                    const fileContent = fs.readFileSync(options.exceptionsFile, 'utf-8');
                    exceptions = fileContent
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line && !line.startsWith('#')); // Skip empty lines and comments

                    // Normalize exceptions paths
                    exceptions = exceptions.map(exception => {
                        // Remove leading /docs/ if present
                        let normalized = exception.replace(/^\/docs\//, '');
                        // Remove .md extension if present
                        normalized = normalized.replace(/\.md$/, '');
                        return normalized;
                    });

                    console.log(`Loaded ${exceptions.length} exceptions from ${options.exceptionsFile}`);
                } catch (err) {
                    console.error("Error reading exceptions file:", err);
                }
            }

            let sidebarItems = [];
            let autogeneratedDirs = [];
            const sidebarsPath = path.join(context.siteDir, 'sidebars.js');
            if (fs.existsSync(sidebarsPath)) {
                try {
                    const sidebars = require(sidebarsPath);
                    const result = getSidebarItemsAndAutogenerated(context, sidebars);
                    sidebarItems = result.items;
                    autogeneratedDirs = result.autogeneratedDirs;
                } catch (err) {
                    console.error("Error loading sidebars.js", err);
                    throw err; // Stop the build
                }
            }

            const markdownFiles = await glob(path.join(docsDir, '**/*.md'));
            const floatingPages = [];

            for (const filePath of markdownFiles) {
                // directories to skip
                if (filePath.includes('_'))
                    continue;

                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data } = matter(fileContent);

                const relativePath = path.relative(docsDir, filePath).replace(/\\/g, '/').replace(/\.md$/, '');

                // Skip if the document has sidebar: false explicitly set
                if (data.sidebar === false) {
                    continue;
                }

                const idToCheck = data.id || relativePath;

                // Skip if the page is in the exceptions list
                if (exceptions.includes(idToCheck) ||
                    exceptions.includes(relativePath) ||
                    exceptions.includes(relativePath + '.md') ||
                    exceptions.includes('/docs/' + relativePath) ||
                    exceptions.includes('/docs/' + relativePath + '.md')) {
                    console.log(`Skipping excepted page: ${relativePath}`);
                    continue;
                }

                // Check various ways this document could be included in the sidebar
                if (isDocumentIncluded(idToCheck, relativePath, sidebarItems, autogeneratedDirs)) {
                    continue;
                }

                floatingPages.push(filePath);
            }

            if (floatingPages.length > 0) {
                if (options && options.failBuild) {
                    console.error('\x1b[31m%s\x1b[0m', `${floatingPages.length} floating pages found:`);
                    floatingPages.forEach(page => console.error(`  - ${page}`));
                    throw new Error('🚨 Floating pages found. See above for details.');
                } else {
                    console.log('⚠️', 'Found floating pages:');
                    floatingPages.forEach(page => console.log(`  - ${page}`));
                }
            } else {
                console.log('✅', 'No floating pages found.');
            }
        }
    }
}

// Helper function to check if a document is included in sidebar or autogenerated directories
function isDocumentIncluded(idToCheck, relativePath, sidebarItems, autogeneratedDirs) {
    // Direct check if ID is in sidebar items
    if (sidebarItems.includes(idToCheck)) {
        return true;
    }

    // Check variations for index pages
    if (relativePath.endsWith('/index')) {
        const parentDir = relativePath.replace(/\/index$/, '');
        if (sidebarItems.includes(parentDir)) {
            return true;
        }
    }

    // Check if any sidebar item is a string and matches the ID without the /index
    for (const item of sidebarItems) {
        if (typeof item === 'string') {
            // If the item directly matches
            if (item === idToCheck) {
                return true;
            }

            // For index pages, check if the parent directory matches
            if (relativePath.endsWith('/index') && item === relativePath.replace(/\/index$/, '')) {
                return true;
            }
        } else if (typeof item === 'object' && item !== null) {
            // Handle link items
            if (item.type === 'link' && item.href) {
                const href = item.href;
                // Extract the path from the href
                let linkPath = href.replace(/^\/docs\//, '').replace(/\/$/, '');

                // Check if this link points to the current document
                if (linkPath === idToCheck ||
                    linkPath === relativePath ||
                    (relativePath.endsWith('/index') && linkPath === relativePath.replace(/\/index$/, ''))) {
                    return true;
                }
            }
        }
    }

    // Check if document is in an autogenerated directory
    for (const dir of autogeneratedDirs) {
        // Direct check
        if (relativePath.startsWith(dir + '/') || relativePath === dir) {
            return true;
        }

        // Handle index files specifically
        if (relativePath === `${dir}/index`) {
            return true;
        }
    }

    return false;
}

function getSidebarItemsAndAutogenerated(context, sidebarConfig) {
    let items = [];
    let autogeneratedDirs = [];

    function traverse(item) {
        if (item.type === 'doc') {
            items.push(item.id);
        } else if (item.type === 'category') {
            // Add the category link itself if it has a link
            if (item.link && item.link.type === 'doc' && item.link.id) {
                items.push(item.link.id);
            }

            // Process all items in the category
            (item.items || []).forEach(traverse);
        } else if (item.type === 'autogenerated') {
            const dirPath = item.dirName;
            let dir;

            // Handle both absolute and relative paths
            if (path.isAbsolute(dirPath)) {
                dir = path.relative(path.resolve(context.siteDir, 'docs'), dirPath);
            } else {
                dir = dirPath;
            }

            dir = dir.replace(/\\/g, '/');

            // Remove leading 'docs/' if present
            dir = dir.replace(/^docs\//, '');

            // Remove trailing slash if present
            dir = dir.replace(/\/$/, '');

            autogeneratedDirs.push(dir);
        } else if (item.type === 'link') {
            // Add the link item directly to check later
            items.push(item);

            // Check if the link is to a local doc
            const href = item.href || '';
            if (href.startsWith('/') && !href.startsWith('//')) {
                // Extract doc ID from local path
                const docPath = href.replace(/^\/docs\//, '').replace(/\/$/, '');
                if (docPath) {
                    items.push(docPath);
                }
            }
        } else if (typeof item === 'string') {
            items.push(item);
        }
    }

    const cleanedSidebarConfig = { ...sidebarConfig };
    // we don't check top level nav
    if (cleanedSidebarConfig.dropdownCategories) {
        delete cleanedSidebarConfig.dropdownCategories;
    }

    Object.values(cleanedSidebarConfig).forEach(sidebar => {
        sidebar.forEach(traverse);
    });

    return {
        items,
        autogeneratedDirs
    };
}

module.exports = checkFloatingPages;