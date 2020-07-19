const got = require('got');
const { join } = require('path');
const { readFile, writeFile } = require('fs').promises;
const { CONTENTFUL_SPACE, CONTENTFUL_ACCESS_TOKEN } = process.env;

const README_PATH = join(__dirname, 'README.md');
const NUMBER_OF_POSTS = 5;

const query = `
  query {
    tilPosts: tilPostCollection(limit: ${NUMBER_OF_POSTS}, order: date_DESC) {
      items {
        title
        slug
      }
    }
    
    blogPosts: contentType2WKn6YEnZewu2ScCkus4AsCollection(limit: ${NUMBER_OF_POSTS}, order: date_DESC) {
      items {
        title
        slug
      }
    }
  }
`;

async function fetchContentfulData() {
  const response = await got.post(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE}`,
    {
      headers: {
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    }
  );
  return JSON.parse(response.body).data;
}

(async () => {
  const { blogPosts, tilPosts } = await fetchContentfulData();

  const readme = (await readFile(README_PATH, 'utf8')).replace(
    /<!-- TABLE.*TABLE_END -->/gs,
    [
      '<!-- TABLE -->',
      '| Blog posts | Today I learned posts |',
      '| --- | --- |',
      [...Array(NUMBER_OF_POSTS).keys()]
        .map((index) => {
          const blogPost = blogPosts.items[index];
          const tilPost = tilPosts.items[index];
          return `| [${blogPost.title}](https://www.stefanjudis.com/blog/${blogPost.slug}/) | [${tilPost.title}](https://www.stefanjudis.com/today-i-learned/${tilPost.slug}/) | `;
        })
        .join('\n'),
      '<!-- TABLE_END -->',
    ].join('\n')
  );

  await writeFile(README_PATH, readme);
})();
