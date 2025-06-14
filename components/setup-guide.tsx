import { Card, CardContent } from "@/components/ui/card"
import { Key, ExternalLink } from "lucide-react"

export function SetupGuide() {
  return (
    <Card className="max-w-2xl mx-auto mb-8 bg-blue-500/10 backdrop-blur-lg border-blue-500/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-blue-300" />
          <h2 className="text-xl font-bold text-white">Setup Required</h2>
        </div>

        <div className="space-y-4 text-blue-200">
          <p>To get real AI-powered mood analysis, you'll need to add your OpenAI API key:</p>

          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>
              Get your API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-100 underline inline-flex items-center gap-1"
              >
                OpenAI Platform <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              Add it as an environment variable:{" "}
              <code className="bg-black/20 px-2 py-1 rounded">OPENAI_API_KEY=your_key_here</code>
            </li>
            <li>Restart your application</li>
          </ol>

          <p className="text-sm">
            💡 <strong>For now:</strong> You can try the demo mode to see how the app works!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
