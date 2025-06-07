'use client';

interface InstructionsSectionProps {
  instructions: string;
}

export default function InstructionsSection({ instructions }: InstructionsSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        👩‍🍳 作り方
      </h2>
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="prose prose-blue max-w-none">
          {instructions.split('\n').map((line, index) => (
            <p key={index} className="text-gray-700 mb-3 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
} 