"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Target, Clock, TrendingUp, Zap, Shield } from 'lucide-react'

interface UserData {
  quitDate: string | null
  dailyGoal: number
  cravingsResisted: number
  streak: number
  moneySaved: number
  cigarettePrice: number
  dailyConsumption: number
}

export default function WellnessApp() {
  const [userData, setUserData] = useState<UserData>({
    quitDate: null,
    dailyGoal: 20,
    cravingsResisted: 0,
    streak: 0,
    moneySaved: 0,
    cigarettePrice: 12,
    dailyConsumption: 20
  })

  const [showSetup, setShowSetup] = useState(true)
  const [currentCraving, setCurrentCraving] = useState(false)
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingCount, setBreathingCount] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('wellnessData')
    if (saved) {
      const data = JSON.parse(saved)
      setUserData(data)
      setShowSetup(false)
    }
  }, [])

  useEffect(() => {
    if (!showSetup) {
      localStorage.setItem('wellnessData', JSON.stringify(userData))
    }
  }, [userData, showSetup])

  const startJourney = () => {
    const newData = {
      ...userData,
      quitDate: new Date().toISOString()
    }
    setUserData(newData)
    setShowSetup(false)
  }

  const resistCraving = () => {
    setUserData(prev => ({
      ...prev,
      cravingsResisted: prev.cravingsResisted + 1,
      streak: prev.streak + 1
    }))
    setCurrentCraving(false)
  }

  const calculateProgress = () => {
    if (!userData.quitDate) return 0
    const quitDate = new Date(userData.quitDate)
    const now = new Date()
    const hoursQuit = Math.floor((now.getTime() - quitDate.getTime()) / (1000 * 60 * 60))
    return Math.min((hoursQuit / 24) * 100, 100)
  }

  const calculateMoneySaved = () => {
    if (!userData.quitDate) return 0
    const quitDate = new Date(userData.quitDate)
    const now = new Date()
    const daysQuit = Math.floor((now.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24))
    return (daysQuit * (userData.cigarettePrice / userData.dailyConsumption) * userData.dailyConsumption).toFixed(2)
  }

  const startBreathing = () => {
    setBreathingActive(true)
    setBreathingCount(0)
    
    const breathingCycle = () => {
      if (breathingCount < 10) {
        setTimeout(() => {
          setBreathingCount(prev => prev + 1)
          breathingCycle()
        }, 4000)
      } else {
        setBreathingActive(false)
        setCurrentCraving(false)
      }
    }
    breathingCycle()
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Mindful</CardTitle>
              <p className="text-gray-600 text-sm">Seu assistente de bem-estar pessoal</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Meta diária de resistência</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setUserData(prev => ({ ...prev, dailyGoal: Math.max(1, prev.dailyGoal - 1) }))}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 bg-gray-100 rounded text-center min-w-[60px]">
                      {userData.dailyGoal}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setUserData(prev => ({ ...prev, dailyGoal: prev.dailyGoal + 1 }))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Investimento mensal atual (R$)</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setUserData(prev => ({ ...prev, cigarettePrice: Math.max(1, prev.cigarettePrice - 1) }))}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 bg-gray-100 rounded text-center min-w-[80px]">
                      R$ {userData.cigarettePrice}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setUserData(prev => ({ ...prev, cigarettePrice: prev.cigarettePrice + 1 }))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                onClick={startJourney}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                Iniciar Jornada
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header discreto */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-gray-800">Mindful</h1>
          <p className="text-gray-600 text-sm">Acompanhe seus objetivos diários</p>
        </div>

        {/* Progresso Principal */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Progresso Hoje</h3>
                <Progress value={calculateProgress()} className="mt-2" />
                <p className="text-sm text-gray-600 mt-1">{calculateProgress().toFixed(1)}% do objetivo diário</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Emergência Discreto */}
        {currentCraving ? (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-100 to-red-100">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <Zap className="w-8 h-8 text-orange-600 mx-auto" />
                <h3 className="font-semibold text-orange-800">Momento de Foco</h3>
                <p className="text-sm text-orange-700">Escolha sua estratégia:</p>
                <div className="space-y-2">
                  <Button 
                    onClick={startBreathing}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={breathingActive}
                  >
                    {breathingActive ? `Respirando... ${breathingCount}/10` : 'Exercício Respiratório'}
                  </Button>
                  <Button 
                    onClick={resistCraving}
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Resistir Agora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button 
            onClick={() => setCurrentCraving(true)}
            className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            Preciso de Apoio
          </Button>
        )}

        {/* Tabs com Estatísticas */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="methods">Métodos</TabsTrigger>
            <TabsTrigger value="rewards">Conquistas</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-md border-0">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{userData.cravingsResisted}</p>
                  <p className="text-xs text-gray-600">Resistências</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-0">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{userData.streak}</p>
                  <p className="text-xs text-gray-600">Sequência</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md border-0">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">R$ {calculateMoneySaved()}</div>
                <p className="text-sm text-gray-600">Economia Total</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-4">
            <div className="space-y-3">
              <Card className="shadow-md border-0">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Respiração 4-7-8</h4>
                  <p className="text-sm text-gray-600">Inspire por 4s, segure por 7s, expire por 8s</p>
                  <Button 
                    onClick={startBreathing}
                    size="sm" 
                    className="mt-2 w-full"
                    disabled={breathingActive}
                  >
                    {breathingActive ? 'Em andamento...' : 'Iniciar'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md border-0">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Distração Rápida</h4>
                  <p className="text-sm text-gray-600">Beba água, escove os dentes ou mastigue algo</p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-0">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Visualização</h4>
                  <p className="text-sm text-gray-600">Imagine-se saudável e livre em 1 ano</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="space-y-3">
              <Card className="shadow-md border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Primeiro Dia</h4>
                      <p className="text-sm text-gray-600">Complete 24h</p>
                    </div>
                    <Badge variant={calculateProgress() >= 100 ? "default" : "secondary"}>
                      {calculateProgress() >= 100 ? "✓" : "🔒"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Resistente</h4>
                      <p className="text-sm text-gray-600">Resista 10 vezes</p>
                    </div>
                    <Badge variant={userData.cravingsResisted >= 10 ? "default" : "secondary"}>
                      {userData.cravingsResisted >= 10 ? "✓" : `${userData.cravingsResisted}/10`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Economizador</h4>
                      <p className="text-sm text-gray-600">Economize R$ 100</p>
                    </div>
                    <Badge variant={parseFloat(calculateMoneySaved()) >= 100 ? "default" : "secondary"}>
                      {parseFloat(calculateMoneySaved()) >= 100 ? "✓" : "🔒"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}