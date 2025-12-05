# Sample Books Generation Script

This script generates sample children's books to populate the gallery.

## Usage

```bash
npm run generate-samples
```

Or directly:

```bash
node scripts/generate-sample-books.js
```

## Requirements

- `VENICE_API_KEY` environment variable set (or it will use the default key)
- Node.js with fetch support (Node 18+)

## Output

The script will:
1. Generate 10 different sample books with varied:
   - Heroes (animals, people, fantasy creatures)
   - Settings (forest, ocean, space, etc.)
   - Categories (Adventure, Magic, Friendship, etc.)
   - Age ranges (kindergarten through 4th grade)
   - Illustration styles

2. Save books to `data/sample-books/`:
   - Individual book files: `{book-id}.json`
   - Index file: `index.json` (contains all books)

## Adding More Books

To add more books, edit `scripts/generate-sample-books.js` and add entries to the `SAMPLE_BOOKS` array:

```javascript
{
  id: 'sample_your_book_id',
  title: 'Your Book Title',
  ageRange: '2nd',
  illustrationStyle: 'Japanese animation style',
  description: 'A brief description of the story',
  category: 'Adventure',
  heroType: 'animal', // or 'person' or 'fantasy'
  setting: 'Your Setting',
  expectedPages: 6,
}
```

## Seasonal Updates

You can create seasonal variations by:
1. Creating new script files (e.g., `generate-holiday-books.js`)
2. Updating the `SAMPLE_BOOKS` array with seasonal themes
3. Running the script to generate new books
4. The books will automatically load into the gallery

## Notes

- The script includes delays between image generations to avoid rate limiting
- Each book takes approximately 1-2 minutes to generate
- Total generation time: ~15-20 minutes for all 10 books

