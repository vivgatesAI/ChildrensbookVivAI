# KinderQuill - Children's Book Generator

A magical AI-powered application that generates personalized children's storybooks with text, illustrations, and audio narration.

## Features

- **Text Generation**: Creates age-appropriate stories using Venice AI
- **Image Generation**: Generates beautiful illustrations using qwen-image model
- **Audio Generation**: On-demand audio narration using Venice TTS
- **Customization Options**:
  - Age range selection (Kindergarten to 5th Grade, default: 2nd Grade)
  - Illustration style selection (Studio Ghibli, Hayao Miyazaki, etc.)

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **AI Services**: Venice.ai API
  - Text: venice-uncensored
  - Images: qwen-image
  - Audio: tts-kokoro

## Getting Started

### Prerequisites

- Node.js 18+ 
- Venice API Key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
VENICE_API_KEY=your_venice_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Railway

1. Connect your GitHub repository to Railway
2. Add environment variable:
   - `VENICE_API_KEY`: Your Venice API key
3. Railway will automatically detect the Next.js app and deploy it

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-book/      # Book generation endpoint
│   │   ├── book/[bookId]/      # Get book data
│   │   ├── book-status/        # Check generation status
│   │   └── generate-audio/     # Audio generation endpoint
│   ├── generate/               # Story generation page
│   ├── generating/             # Generation progress page
│   ├── book/[bookId]/          # Book viewer page
│   └── page.tsx                # Welcome page
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/generate-book`
Generates a new children's book.

**Request Body:**
```json
{
  "storyIdea": "A brave knight who is afraid of spiders",
  "ageRange": "2nd",
  "illustrationStyle": "Studio Ghibli"
}
```

**Response:**
```json
{
  "bookId": "book_1234567890_abc123",
  "status": "generating"
}
```

### GET `/api/book/[bookId]`
Retrieves a completed book.

### GET `/api/book-status/[bookId]`
Checks the generation status of a book.

### POST `/api/generate-audio/[bookId]`
Generates audio narration for a completed book.

## Notes

- Books are currently stored in-memory. For production, implement a database (PostgreSQL, MongoDB, etc.)
- Image generation may take some time. The app polls for completion status.
- Audio generation is on-demand and only happens when requested by the user.

## License

MIT

