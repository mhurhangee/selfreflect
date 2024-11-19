'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"

interface Question {
  id: number
  text: string[]
  options?: string[]
  type: 'options' | 'text'
}

const initialQuestions: Question[] = [
  { 
    id: 1, 
    text: ["How are you", "feeling today?"],
    options: ["Happy", "Sad", "Anxious", "Excited", "Tired"],
    type: 'options'
  },
  { 
    id: 2, 
    text: ["What's one thing", "you're grateful for?"],
    type: 'text'
  },
  { 
    id: 3, 
    text: ["What's a small goal", "you have for today?"],
    type: 'text'
  }
]

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.2, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 1, ease: "easeIn" }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.4, duration: 0.8, ease: "easeOut" }
  })
}

const AnimatedText = ({ children, custom }: { children: React.ReactNode; custom: number }) => (
  <motion.div
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    custom={custom}
  >
    {children}
  </motion.div>
)

export default function CalmForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [questions, setQuestions] = useState(initialQuestions)
  const [answers, setAnswers] = useState<{[key: number]: string[] | string}>({})

  const generateNextQuestion = useCallback(() => {
    const newQuestion: Question = {
      id: questions.length + 1,
      text: [`Generated question ${questions.length + 1}`, `part 2`],
      type: Math.random() > 0.5 ? 'options' : 'text',
      options: Math.random() > 0.5 ? ["Option 1", "Option 2", "Option 3"] : undefined
    }
    setQuestions(prev => [...prev, newQuestion])
  }, [questions])

  const nextStep = () => {
    if (currentStep === questions.length - 1) {
      generateNextQuestion()
    }
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleOptionToggle = (questionId: number, option: string) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] as string[] || []
      if (currentAnswers.includes(option)) {
        return { ...prev, [questionId]: currentAnswers.filter(a => a !== option) }
      } else {
        return { ...prev, [questionId]: [...currentAnswers, option] }
      }
    })
  }

  const handleTextChange = (questionId: number, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl text-center text-gray-700">
                <AnimatedText custom={0}>
                  {currentStep === 0 ? "Welcome" : `Question ${currentStep}`}
                </AnimatedText>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
              {currentStep === 0 ? (
                <AnimatedText custom={1}>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Take a moment to reflect.
                  </p>
                </AnimatedText>
              ) : (
                <>
                  <AnimatedText custom={1}>
                    <p className="text-2xl text-gray-700 mb-2">{questions[currentStep - 1].text[0]}</p>
                  </AnimatedText>
                  <AnimatedText custom={2}>
                    <p className="text-2xl text-gray-700 mb-6">{questions[currentStep - 1].text[1]}</p>
                  </AnimatedText>
                  <AnimatedText custom={3}>
                    {questions[currentStep - 1].type === 'options' && questions[currentStep - 1].options && (
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {questions[currentStep - 1].options?.map((option, index) => (
                          <Toggle
                            key={index}
                            pressed={answers[currentStep]?.includes(option)}
                            onPressedChange={() => handleOptionToggle(currentStep, option)}
                            className="bg-white/30 hover:bg-white/50 data-[state=on]:bg-blue-200 data-[state=on]:text-blue-700"
                          >
                            {option}
                          </Toggle>
                        ))}
                      </div>
                    )}
                    {questions[currentStep - 1].type === 'text' && (
                      <input
                        className="mt-4 w-full bg-white/30 backdrop-blur-sm border-gray-200 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all duration-300"
                        placeholder="Type your answer here..."
                        value={answers[currentStep] as string || ''}
                        onChange={(e) => handleTextChange(currentStep, e.target.value)}
                      />
                    )}
                  </AnimatedText>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-center space-x-4 pb-8">
              <AnimatedText custom={4}>
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    className="mr-4 px-6 py-2 text-lg text-gray-600 border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    Back
                  </Button>
                )}
                <Button 
                  onClick={nextStep}
                  className="px-6 py-2 text-lg font-light bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-300"
                >
                  {currentStep === 0 ? "Begin" : "Next"}
                </Button>
              </AnimatedText>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}