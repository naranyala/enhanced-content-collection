import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

function organizeByHeading(collectionName, parentSlug, inputData) {
  const organizedData = [];
  const headingStack = [];
  let previousLevel = 0; // Track the previous heading level

  for (const item of inputData) {
    while (headingStack.length >= item.level) {
      headingStack.pop();
    }

    let parent = headingStack[headingStack.length - 1];

    if (item.level === 1) {
      parent = organizedData;
    } else if (!parent) {
      throw new Error(`
        Collection\t: ${collectionName}\nContent\t\t: ${parentSlug}\nError\t\t: The heading with level ${item.level} doesn't have a valid parent.
      `);
    } else if (item.level > previousLevel + 1) {
      throw new Error(`
        Collection\t: ${collectionName}\nContent\t\t: ${parentSlug}\nError\t\t: Invalid heading hierarchy. Heading level ${item.level} is not allowed after level ${previousLevel}.
      `);
    }

    const newItem = {
      "type": `h${item.level}`,
      "text": item.text,
      "link": item.link,
      "children": [],
    };

    parent.push(newItem);
    headingStack.push(newItem.children);
    previousLevel = item.level; // Update the previous level
  }

  return organizedData;
}

function resolveHeading(collectionName, parentSlug, markdownContent) {
  const md = new MarkdownIt();
  const headings = [];
  const tokens = md.parse(markdownContent);

  for (const token of tokens) {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.slice(1), 10);
      const text = tokens[tokens.indexOf(token) + 1].content;
      const headingHtml = sanitizeHtml(text);
      const cleanSlug = headingHtml.toLowerCase().replace(/\s+/g, '-');
      const link = `${parentSlug}#${cleanSlug}`;

      headings.push({ level, text, link });
    }
  }

  const tempHeading = organizeByHeading(collectionName, parentSlug, headings);
  return tempHeading;
}

export function enhanceContentCollection(contentCollectionOrigin) {
  const finalContent = contentCollectionOrigin.map((item) => {
    const headings = resolveHeading(item.collection, item.slug, item.body);

    return { ...item, headings };
  });

  return finalContent;
}
