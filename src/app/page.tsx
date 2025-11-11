"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Shield, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Lock,
  Users,
  Award,
  DollarSign
} from 'lucide-react'

interface QuestionnaireData {
  smokingYears: string
  dailyCigarettes: string
  quitAttempts: string
  motivation: string
  concerns: string[]
  name: string
  email: string
}

export default function SmokingAppLanding() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'questionnaire' | 'results' | 'purchase'>('landing')
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    smokingYears: '',
    dailyCigarettes: '',
    quitAttempts: '',
    motivation: '',
    concerns: [],
    name: '',
    email: ''
  })
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions = [
    {
      id: 'smokingYears',
      question: 'Há quantos anos você fuma?',
      type: 'select',
      options: ['Menos de 1 ano', '1-5 anos', '6-10 anos', '11-20 anos', 'Mais de 20 anos']
    },
    {
      id: 'dailyCigarettes',
      question: 'Quantos cigarros você fuma por dia?',
      type: 'select',
      options: ['1-5 cigarros', '6-10 cigarros', '11-20 cigarros', '21-30 cigarros', 'Mais de 30 cigarros']
    },
    {
      id: 'quitAttempts',
      question: 'Quantas vezes já tentou parar?',
      type: 'select',
      options: ['Nunca tentei', '1-2 vezes', '3-5 vezes', '6-10 vezes', 'Mais de 10 vezes']
    },
    {
      id: 'motivation',
      question: 'Qual sua principal motivação para parar?',
      type: 'select',
      options: ['Saúde', 'Economia', 'Família', 'Aparência', 'Pressão social']
    },
    {
      id: 'concerns',
      question: 'Quais são suas maiores preocupações? (pode marcar várias)',
      type: 'multiple',
      options: ['Ansiedade', 'Ganho de peso', 'Irritabilidade', 'Falta de concentração', 'Pressão social', 'Recaídas']
    },
    {
      id: 'contact',
      question: 'Para finalizar, precisamos de seus dados:',
      type: 'contact',
      options: []
    }
  ]

  const handleQuestionnaireAnswer = (answer: string | string[]) => {
    const currentQ = questions[currentQuestion]
    
    if (currentQ.id === 'concerns') {
      setQuestionnaireData(prev => ({ ...prev, concerns: answer as string[] }))
    } else if (currentQ.id === 'contact') {
      // Handled separately
      return
    } else {
      setQuestionnaireData(prev => ({ ...prev, [currentQ.id]: answer as string }))
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCurrentStep('results')
    }
  }

  const handleContactSubmit = () => {
    if (questionnaireData.name && questionnaireData.email) {
      setCurrentStep('results')
    }
  }

  const calculatePersonalizedPrice = () => {
    let basePrice = 97
    
    // Ajuste baseado nos anos fumando
    if (questionnaireData.smokingYears.includes('Mais de 20')) basePrice += 30
    else if (questionnaireData.smokingYears.includes('11-20')) basePrice += 20
    
    // Ajuste baseado na quantidade diária
    if (questionnaireData.dailyCigarettes.includes('Mais de 30')) basePrice += 25
    else if (questionnaireData.dailyCigarettes.includes('21-30')) basePrice += 15
    
    return basePrice
  }

  const calculateMonthlySavings = () => {
    let cigarettesPerDay = 10 // default
    
    if (questionnaireData.dailyCigarettes.includes('1-5')) cigarettesPerDay = 3
    else if (questionnaireData.dailyCigarettes.includes('6-10')) cigarettesPerDay = 8
    else if (questionnaireData.dailyCigarettes.includes('11-20')) cigarettesPerDay = 15
    else if (questionnaireData.dailyCigarettes.includes('21-30')) cigarettesPerDay = 25
    else if (questionnaireData.dailyCigarettes.includes('Mais de 30')) cigarettesPerDay = 35
    
    const pricePerCigarette = 0.60 // média
    const dailyCost = cigarettesPerDay * pricePerCigarette
    const monthlySavings = dailyCost * 30
    
    return monthlySavings.toFixed(0)
  }

  if (currentStep === 'questionnaire') {
    const currentQ = questions[currentQuestion]
    
    if (currentQ.id === 'contact') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
          <div className="max-w-md mx-auto pt-20">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Quase lá! 🎉
                </CardTitle>
                <p className="text-gray-600">Seus dados para receber o resultado personalizado</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu nome completo
                  </label>
                  <input
                    type="text"
                    value={questionnaireData.name}
                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Digite seu nome"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu melhor e-mail
                  </label>
                  <input
                    type="email"
                    value={questionnaireData.email}
                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <Button 
                  onClick={handleContactSubmit}
                  disabled={!questionnaireData.name || !questionnaireData.email}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
                >
                  Ver Meu Resultado Personalizado
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="mb-6">
            <Progress value={(currentQuestion / questions.length) * 100} className="mb-2" />
            <p className="text-center text-sm text-gray-600">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>
          
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-gray-800">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQ.type === 'multiple' ? (
                <div className="space-y-2">
                  {currentQ.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={questionnaireData.concerns.includes(option)}
                        onChange={(e) => {
                          const newConcerns = e.target.checked 
                            ? [...questionnaireData.concerns, option]
                            : questionnaireData.concerns.filter(c => c !== option)
                          setQuestionnaireData(prev => ({ ...prev, concerns: newConcerns }))
                        }}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                  <Button 
                    onClick={() => handleQuestionnaireAnswer(questionnaireData.concerns)}
                    disabled={questionnaireData.concerns.length === 0}
                    className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
                  >
                    Continuar
                  </Button>
                </div>
              ) : (
                currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuestionnaireAnswer(option)}
                    variant="outline"
                    className="w-full p-4 text-left justify-start hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                  >
                    {option}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === 'results') {
    const personalizedPrice = calculatePersonalizedPrice()
    const monthlySavings = calculateMonthlySavings()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="max-w-2xl mx-auto pt-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Olá, {questionnaireData.name}! 👋
            </h1>
            <p className="text-gray-600">Aqui está seu plano personalizado para parar de fumar</p>
          </div>

          <div className="grid gap-6 mb-8">
            <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Você pode economizar</h3>
                <div className="text-4xl font-bold mb-2">R$ {monthlySavings}</div>
                <p className="opacity-90">por mês parando de fumar</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Seu Perfil</h4>
                  <p className="text-sm text-gray-600">
                    {questionnaireData.smokingYears} fumando, {questionnaireData.dailyCigarettes.toLowerCase()}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Motivação</h4>
                  <p className="text-sm text-gray-600">{questionnaireData.motivation}</p>
                </CardContent>
              </Card>
            </div>

            {questionnaireData.concerns.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    Suas preocupações serão tratadas:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {questionnaireData.concerns.map((concern, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {concern}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl font-bold text-gray-800">
                🎯 Mindful - Seu App Personalizado
              </CardTitle>
              <p className="text-gray-600">Método discreto e eficaz para parar de fumar</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Totalmente Discreto</h4>
                    <p className="text-sm text-gray-600">Ninguém precisa saber que você está usando</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Técnicas Comprovadas</h4>
                    <p className="text-sm text-gray-600">Respiração, distração e recompensas personalizadas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Acompanhamento 24/7</h4>
                    <p className="text-sm text-gray-600">Suporte sempre que precisar, onde estiver</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Economia Visível</h4>
                    <p className="text-sm text-gray-600">Veja quanto está economizando em tempo real</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Oferta personalizada para você:</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl text-gray-400 line-through">R$ 197</span>
                    <span className="text-4xl font-bold text-emerald-600">R$ {personalizedPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pagamento único • Acesso vitalício</p>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentStep('purchase')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                🚀 Quero Parar de Fumar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  Compra Segura
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  7 dias de garantia
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === 'purchase') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Finalizar Compra
              </CardTitle>
              <p className="text-gray-600">Mindful - App para Parar de Fumar</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Mindful App</span>
                  <span className="font-bold text-emerald-600">R$ {calculatePersonalizedPrice()}</span>
                </div>
                <p className="text-sm text-gray-600">Acesso vitalício • Todas as funcionalidades</p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
                  onClick={() => {
                    // Aqui você integraria com seu sistema de pagamento
                    alert('Redirecionando para pagamento seguro...')
                  }}
                >
                  💳 Pagar com Cartão - R$ {calculatePersonalizedPrice()}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full py-4 text-lg font-semibold rounded-xl border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => {
                    // Aqui você integraria com PIX
                    alert('Gerando código PIX...')
                  }}
                >
                  📱 Pagar com PIX - R$ {calculatePersonalizedPrice()}
                </Button>
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    SSL Seguro
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Garantia 7 dias
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Processamento seguro • Dados protegidos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Landing Page Principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
              ✨ Método Discreto e Comprovado
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Pare de Fumar de Forma
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Discreta</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              O único app que te ajuda a parar de fumar sem que ninguém perceba. 
              Técnicas comprovadas, suporte 24/7 e resultados reais.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => setCurrentStep('questionnaire')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🎯 Fazer Teste Gratuito
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              📱 Ver Como Funciona
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-gray-600">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span className="text-sm">+2.847 pessoas</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span className="text-sm">4.9/5 estrelas</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              <span className="text-sm">87% de sucesso</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Por que o Mindful é Diferente?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desenvolvido especialmente para quem quer parar de fumar sem chamar atenção
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">100% Discreto</h3>
              <p className="text-gray-600">
                Interface que parece um app de bem-estar comum. Ninguém vai suspeitar que você está parando de fumar.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Técnicas Comprovadas</h3>
              <p className="text-gray-600">
                Respiração 4-7-8, distração cognitiva e sistema de recompensas baseado em neurociência.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Suporte 24/7</h3>
              <p className="text-gray-600">
                Botão de emergência sempre disponível. Técnicas de alívio imediato quando a vontade bater.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Histórias de Sucesso
            </h2>
            <p className="text-xl text-gray-600">
              Pessoas reais que conseguiram parar de fumar com o Mindful
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Fumava há 15 anos e já tinha tentado parar 6 vezes. Com o Mindful consegui em 3 semanas. O melhor é que ninguém no trabalho percebeu."
                </p>
                <div className="font-semibold text-gray-800">Marina, 34 anos</div>
                <div className="text-sm text-gray-500">Economizou R$ 2.400 em 6 meses</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "O que mais me ajudou foram as técnicas de respiração. Sempre que batia a vontade, eu abria o app discretamente e fazia o exercício."
                </p>
                <div className="font-semibold text-gray-800">Carlos, 28 anos</div>
                <div className="text-sm text-gray-500">Livre do cigarro há 8 meses</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Tentei adesivos, gomas, livros... Nada funcionou. O Mindful foi diferente porque me deu suporte na hora exata que eu precisava."
                </p>
                <div className="font-semibold text-gray-800">Ana, 41 anos</div>
                <div className="text-sm text-gray-500">Parou após 20 anos fumando</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Sua Última Tentativa?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Faça o teste gratuito e descubra seu plano personalizado para parar de fumar de forma discreta e definitiva.
          </p>
          
          <Button 
            onClick={() => setCurrentStep('questionnaire')}
            className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-xl font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            🎯 Começar Teste Gratuito Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <div className="flex items-center justify-center space-x-6 mt-8 text-emerald-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Teste 100% gratuito</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Resultado em 2 minutos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}