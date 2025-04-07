"use client"

import type React from "react"

import { useState } from "react"
import { Search, Activity, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HealthBot() {
  const [symptoms, setSymptoms] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const predictDisease = () => {
    if (!symptoms.trim()) return

    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const input = symptoms.toLowerCase()

      // Expanded symptom mapping with more Indian diseases
      const symptomMapping: Record<string, string> = {
        "sir dukh raha hai": "Headache / सर दर्द, Migraine / माइग्रेन, Stress / तनाव, Sinusitis / साइनसाइटिस",
        "sar dard": "Headache / सर दर्द, Migraine / माइग्रेन, Stress / तनाव, Sinusitis / साइनसाइटिस",
        headache: "Headache / सर दर्द, Migraine / माइग्रेन, Stress / तनाव, Sinusitis / साइनसाइटिस",
        bukhar: "Fever / बुखार, Dengue / डेंगू, Malaria / मलेरिया, Typhoid / टाइफॉइड, COVID-19, Chikungunya / चिकनगुनिया",
        fever: "Fever / बुखार, Dengue / डेंगू, Malaria / मलेरिया, Typhoid / टाइफॉइड, COVID-19, Chikungunya / चिकनगुनिया",
        khansi: "Cough / खांसी, Tuberculosis / टीबी, Asthma / अस्थमा, Pneumonia / निमोनिया, Bronchitis / ब्रोंकाइटिस",
        cough: "Cough / खांसी, Tuberculosis / टीबी, Asthma / अस्थमा, Pneumonia / निमोनिया, Bronchitis / ब्रोंकाइटिस",
        "pet dukh raha hai":
          "Stomach Pain / पेट दर्द, Gastritis / गैस्ट्राइटिस, Food Poisoning / फूड पॉइज़निंग, Appendicitis / अपेंडिसाइटिस, IBS / आईबीएस",
        "stomach pain":
          "Stomach Pain / पेट दर्द, Gastritis / गैस्ट्राइटिस, Food Poisoning / फूड पॉइज़निंग, Appendicitis / अपेंडिसाइटिस, IBS / आईबीएस",
        "saans lene mein dikkat":
          "Breathing Problem / सांस लेने में दिक्कत, Asthma / अस्थमा, COPD, Heart Failure / हृदय विफलता, Pulmonary Fibrosis / फेफड़ों का फाइब्रोसिस",
        "breathing problem":
          "Breathing Problem / सांस लेने में दिक्कत, Asthma / अस्थमा, COPD, Heart Failure / हृदय विफलता, Pulmonary Fibrosis / फेफड़ों का फाइब्रोसिस",
        "chakkar aa raha hai":
          "Dizziness / चक्कर, Low BP / लो ब्लड प्रेशर, Anemia / एनीमिया, Vertigo / वर्टिगो, Hypoglycemia / हाइपोग्लाइसीमिया",
        dizziness:
          "Dizziness / चक्कर, Low BP / लो ब्लड प्रेशर, Anemia / एनीमिया, Vertigo / वर्टिगो, Hypoglycemia / हाइपोग्लाइसीमिया",
        "dil tez dhadak raha hai":
          "Palpitations / दिल की धड़कन तेज, Anxiety / चिंता, Hyperthyroidism / हाइपरथायरॉयडिज्म, Arrhythmia / अरिदमिया",
        palpitations:
          "Palpitations / दिल की धड़कन तेज, Anxiety / चिंता, Hyperthyroidism / हाइपरथायरॉयडिज्म, Arrhythmia / अरिदमिया",
        "gas ho rahi hai": "Gas / गैस, Acidity / एसिडिटी, Indigestion / अपच, GERD / गर्ड, Peptic Ulcer / पेप्टिक अल्सर",
        gas: "Gas / गैस, Acidity / एसिडिटी, Indigestion / अपच, GERD / गर्ड, Peptic Ulcer / पेप्टिक अल्सर",
        "twacha par daag hai":
          "Skin Rash / त्वचा पर दाग, Allergy / एलर्जी, Fungal Infection / फंगल संक्रमण, Eczema / एक्जिमा, Psoriasis / सोरायसिस",
        "skin rash":
          "Skin Rash / त्वचा पर दाग, Allergy / एलर्जी, Fungal Infection / फंगल संक्रमण, Eczema / एक्जिमा, Psoriasis / सोरायसिस",
        "aankhon mein jalan":
          "Eye Irritation / आँखों में जलन, Conjunctivitis / कंजक्टिवाइटिस, Dry Eyes / सूखी आँखें, Glaucoma / ग्लूकोमा",
        "eye irritation":
          "Eye Irritation / आँखों में जलन, Conjunctivitis / कंजक्टिवाइटिस, Dry Eyes / सूखी आँखें, Glaucoma / ग्लूकोमा",
        "joint pain":
          "Joint Pain / जोड़ों का दर्द, Arthritis / गठिया, Rheumatoid Arthritis / रूमेटाइड अर्थराइटिस, Gout / गाउट",
        "jodo me dard":
          "Joint Pain / जोड़ों का दर्द, Arthritis / गठिया, Rheumatoid Arthritis / रूमेटाइड अर्थराइटिस, Gout / गाउट",
        weakness:
          "Weakness / कमजोरी, Anemia / एनीमिया, Vitamin Deficiency / विटामिन की कमी, Hypothyroidism / हाइपोथायरॉयडिज्म",
        kamzori:
          "Weakness / कमजोरी, Anemia / एनीमिया, Vitamin Deficiency / विटामिन की कमी, Hypothyroidism / हाइपोथायरॉयडिज्म",
        ulti: "Vomiting / उल्टी, Food Poisoning / फूड पॉइज़निंग, Gastroenteritis / गैस्ट्रोएंटेराइटिस, Morning Sickness / मॉर्निंग सिकनेस",
        vomiting:
          "Vomiting / उल्टी, Food Poisoning / फूड पॉइज़निंग, Gastroenteritis / गैस्ट्रोएंटेराइटिस, Morning Sickness / मॉर्निंग सिकनेस",
        dast: "Diarrhea / दस्त, Food Poisoning / फूड पॉइज़निंग, Irritable Bowel Syndrome / इरिटेबल बाउल सिंड्रोम, Gastroenteritis / गैस्ट्रोएंटेराइटिस",
        diarrhea:
          "Diarrhea / दस्त, Food Poisoning / फूड पॉइज़निंग, Irritable Bowel Syndrome / इरिटेबल बाउल सिंड्रोम, Gastroenteritis / गैस्ट्रोएंटेराइटिस",
        khujli: "Itching / खुजली, Allergy / एलर्जी, Fungal Infection / फंगल संक्रमण, Scabies / खुजली रोग, Eczema / एक्जिमा",
        itching: "Itching / खुजली, Allergy / एलर्जी, Fungal Infection / फंगल संक्रमण, Scabies / खुजली रोग, Eczema / एक्जिमा",
      }

      // Check for exact matches first
      if (symptomMapping[input]) {
        setResult(symptomMapping[input])
      } else {
        // If no exact match, check if any key contains the input
        const matchingKeys = Object.keys(symptomMapping).filter((key) => key.includes(input) || input.includes(key))

        if (matchingKeys.length > 0) {
          // Use the first matching key
          setResult(symptomMapping[matchingKeys[0]])
        } else {
          setResult("No matching disease found. / कोई मेल खाने वाली बीमारी नहीं मिली")
        }
      }

      setIsLoading(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      predictDisease()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <Card className="w-full max-w-md border border-green-500/20 bg-black/80 backdrop-blur-md shadow-xl shadow-green-500/10">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Health Bot
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your symptoms in Hinglish or English for AI-powered diagnosis
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Enter symptoms (e.g., sir dukh raha hai, fever)"
              className="pl-9 bg-gray-900/60 border-gray-800 focus:border-green-500 text-white"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Button
            onClick={predictDisease}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 animate-pulse" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Get Diagnosis
              </span>
            )}
          </Button>

          {result && (
            <div className="mt-6 p-4 rounded-lg bg-gray-900/60 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Possible Diseases:</h3>
              <div className="flex flex-wrap gap-2">
                {result.split(", ").map((disease, index) => (
                  <Badge key={index} variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                    {disease}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col gap-2">
            <a
              href="https://www.apollopharmacy.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-white transition-colors text-sm flex items-center justify-center p-2 rounded-md border border-green-900/50 bg-green-900/10 hover:bg-green-900/30"
            >
              Buy Medicines
            </a>
            <a
              href="https://kims.kiit.ac.in/hospital/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-white transition-colors text-sm flex items-center justify-center p-2 rounded-md border border-green-900/50 bg-green-900/10 hover:bg-green-900/30"
            >
              Nearby Hospital Support
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

