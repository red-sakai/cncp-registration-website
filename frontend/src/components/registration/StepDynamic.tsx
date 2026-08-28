import { Question } from "@/types/event";
import { RegistrationFormData } from "./types";
import { useState } from "react";

interface StepDynamicProps {
  questions: Question[];
  formData: RegistrationFormData;
  updateData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  eventSlug: string;
}

export function StepDynamic({ 
  questions, 
  formData, 
  updateData, 
  onNext, 
  onBack,
  eventSlug
}: StepDynamicProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    const errors: Record<string, string> = {};
    
    // Validate required questions and patterns
    questions.forEach(q => {
      const answer = formData.dynamicAnswers[q.id.toString()];
      
      if (q.required && !answer) {
        errors[q.id.toString()] = 'This field is required';
      } else if (answer && typeof answer === 'string' && q.type === 'text' && q.validationPattern) {
        const regex = new RegExp(q.validationPattern);
        if (!regex.test(answer)) {
          errors[q.id.toString()] = q.validationMessage || 'Invalid format';
        }
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    onNext();
  };

  const updateAnswer = (questionId: number | string, value: string | File) => {
    updateData({
      dynamicAnswers: {
        ...formData.dynamicAnswers,
        [questionId.toString()]: value
      }
    });
    // Clear validation error when user types
    if (validationErrors[questionId.toString()]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId.toString()];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] tracking-tight mb-2 leading-tight">
              Additional Information
            </h2>
            <p className="text-white/60 mb-6 sm:mb-8 ml-1 text-[11px] sm:text-sm">
              Please provide the following information
            </p>
          </div>

          <div className="space-y-5">
            {questions.map((question) => {
              const questionType = question.type || 'text';
              const error = validationErrors[question.id.toString()];
              
              return (
                <div key={question.id} className="space-y-2">
                  <label className="text-[#c5a55a] text-[11px] font-medium block">
                    {question.text}
                    {question.required && (
                      <span className="text-[#c5a55a] ml-1">*</span>
                    )}
                  </label>

                  {/* Text Input */}
                  {questionType === 'text' && (
                    <input
                      type="text"
                      value={(formData.dynamicAnswers[question.id.toString()] as string) || ''}
                      onChange={(e) => updateAnswer(question.id, e.target.value)}
                      required={question.required}
                      placeholder="Type your answer here..."
                      className={`w-full !bg-[rgba(0,26,51,0.9)] border ${error ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 !text-white text-sm !placeholder:text-white/40 outline-none transition-all duration-200 focus:border-[#c5a55a] focus:outline-none`}
                    />
                  )}

                  {/* Multiple Choice */}
                  {questionType === 'multiple_choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#c5a55a]/50 cursor-pointer transition-all"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={(formData.dynamicAnswers[question.id.toString()] as string) === option}
                            onChange={(e) => updateAnswer(question.id, e.target.value)}
                            required={question.required}
                            className="w-4 h-4 text-[#c5a55a] bg-[rgba(0,26,51,0.9)] border-white/20 focus:ring-[#c5a55a] focus:ring-offset-0"
                          />
                          <span className="text-white text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Dropdown */}
                  {questionType === 'dropdown' && question.options && (
                    <select
                      value={(formData.dynamicAnswers[question.id.toString()] as string) || ''}
                      onChange={(e) => updateAnswer(question.id, e.target.value)}
                      required={question.required}
                      className={`w-full !bg-[rgba(0,26,51,0.9)] border ${error ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 !text-white text-sm outline-none transition-all duration-200 focus:border-[#c5a55a] focus:outline-none cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select an option...
                      </option>
                      {question.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* File Upload */}
                  {questionType === 'file_upload' && (
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateAnswer(question.id, file);
                          }
                        }}
                        required={question.required && !formData.dynamicAnswers[question.id.toString()]}
                        className="w-full !bg-[rgba(0,26,51,0.9)] border border-white/20 rounded-xl px-4 py-3 !text-white text-sm outline-none transition-all duration-200 focus:border-[#c5a55a] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c5a55a]/20 file:text-[#c5a55a] hover:file:bg-[#c5a55a]/30 file:cursor-pointer"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-white/40 text-xs ml-1">
                          Only PDF files accepted
                        </p>
                        {formData.dynamicAnswers[question.id.toString()] instanceof File && (
                          <p className="text-green-400 text-xs ml-1">
                            ✓ {(formData.dynamicAnswers[question.id.toString()] as File).name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Validation Error */}
                  {error && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl border border-white/20 hover:bg-white/5 text-white/70 font-semibold text-sm transition-all duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3.5 rounded-xl bg-[#049fd9] hover:bg-[#0389b8] text-white font-semibold text-sm transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
