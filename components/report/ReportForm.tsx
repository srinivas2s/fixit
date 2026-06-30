'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Upload, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  latitude: z.number(),
  longitude: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReportForm() {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ category: string, severity: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: 12.9716, // Default to Bangalore for mock
      longitude: 77.5946,
    }
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      simulateAIClassification(file);
    }
  });

  // Mock Gemini Vision API
  const simulateAIClassification = (file: File) => {
    setIsClassifying(true);
    setTimeout(() => {
      // Randomly assign a category and severity for the mock
      const categories = ['pothole', 'garbage', 'streetlight', 'water_leak'];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const randomSev = Math.floor(Math.random() * 8) + 2; // 2 to 9
      
      setAiAnalysis({ category: randomCat, severity: randomSev });
      setIsClassifying(false);
    }, 2000); // 2 second fake delay
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Upload Image (mocked out if Supabase storage isn't set up, but we'll try)
      let imageUrl = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop'; // fallback
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('report_images')
          .upload(filePath, imageFile);
          
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('report_images').getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }

      // 2. Insert Report
      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          title: data.title,
          description: data.description,
          category: aiAnalysis?.category || 'other',
          latitude: data.latitude,
          longitude: data.longitude,
          image_url: imageUrl,
          citizen_id: user.id,
          urgency_score: aiAnalysis?.severity || 1,
          status: 'reported',
          department_id: null // Unassigned initially
        });

      if (insertError) throw insertError;

      // 3. Success, redirect to map
      setStep(4); // Success step
      setTimeout(() => {
        router.push('/map');
      }, 2000);

    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-card-border -z-10 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(step - 1) * 33.33}%` }} />
        
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step >= s ? 'bg-primary text-navy shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-navy border-2 border-card-border text-text-secondary'
            }`}
          >
            {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* STEP 1: Photo Upload */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Upload Photo</h2>
                <p className="text-text-secondary text-sm">Clear photos help our AI classify the issue accurately.</p>
              </div>

              {!imagePreview ? (
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-card-border hover:border-text-secondary/50 hover:bg-white/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 bg-navy-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-text-secondary" />
                  </div>
                  <p className="text-text-primary font-medium mb-1">Drag & drop a photo here</p>
                  <p className="text-sm text-text-secondary mb-4">or click to browse from your device</p>
                  <span className="px-4 py-2 bg-navy border border-card-border rounded-lg text-sm font-medium">Browse Files</span>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-card-border bg-navy-light aspect-video flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-50" />
                  
                  {isClassifying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/60 backdrop-blur-sm">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                      </div>
                      <p className="mt-4 font-medium text-white tracking-widest uppercase text-sm animate-pulse">
                        AI Vision Analyzing...
                      </p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/80 backdrop-blur-md p-6">
                      <div className="w-16 h-16 bg-primary/20 border border-primary/50 rounded-full flex items-center justify-center mb-4 text-primary">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Analysis Complete</h3>
                      <div className="flex gap-4">
                        <div className="bg-navy border border-card-border px-4 py-2 rounded-xl text-center">
                          <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Category</div>
                          <div className="font-bold text-primary capitalize">{aiAnalysis.category.replace('_', ' ')}</div>
                        </div>
                        <div className="bg-navy border border-card-border px-4 py-2 rounded-xl text-center">
                          <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Severity</div>
                          <div className="font-bold text-urgency-orange">{aiAnalysis.severity}/10</div>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <button 
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); setAiAnalysis(null); }}
                          className="px-4 py-2 border border-card-border rounded-lg text-sm hover:bg-white/5 transition-colors"
                        >
                          Retake Photo
                        </button>
                        <button 
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-6 py-2 bg-primary text-navy font-bold rounded-lg text-sm hover:bg-primary-hover transition-colors"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Pin the Location</h2>
                <p className="text-text-secondary text-sm">Where exactly is this issue located?</p>
              </div>

              <div className="bg-navy-light/50 border border-card-border rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Use Current Location</h3>
                <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
                  For the most accurate routing, allow FixIt to access your device's GPS location.
                </p>
                <button
                  type="button"
                  onClick={getUserLocation}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors mb-4"
                >
                  Locate Me
                </button>
                <div className="grid grid-cols-2 gap-4 mt-4 text-left">
                  <div className="p-3 bg-navy border border-card-border rounded-lg">
                    <label className="text-xs text-text-secondary uppercase">Latitude</label>
                    <div className="font-mono text-sm">{watch('latitude').toFixed(6)}</div>
                  </div>
                  <div className="p-3 bg-navy border border-card-border rounded-lg">
                    <label className="text-xs text-text-secondary uppercase">Longitude</label>
                    <div className="font-mono text-sm">{watch('longitude').toFixed(6)}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-card-border rounded-xl font-semibold hover:bg-white/5 transition-colors">
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 bg-primary text-navy rounded-xl font-bold hover:bg-primary-hover transition-colors">
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Issue Details</h2>
                <p className="text-text-secondary text-sm">Provide context to help authorities resolve this faster.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Title (Brief Description)</label>
                  <input
                    {...register('title')}
                    className="w-full px-4 py-3 bg-navy border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="E.g., Massive pothole on Main St."
                  />
                  {errors.title && <p className="text-urgency-red text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Additional Details</label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 bg-navy border border-card-border rounded-xl text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                    placeholder="Is it causing traffic? How long has it been there? Any landmarks nearby?"
                  />
                  {errors.description && <p className="text-urgency-red text-xs mt-1">{errors.description.message}</p>}
                </div>
              </div>

              {aiAnalysis && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-primary mb-1">AI Classification Summary</h4>
                    <p className="text-xs text-text-secondary">
                      This report will be automatically tagged as <span className="font-bold text-white capitalize">{aiAnalysis.category.replace('_', ' ')}</span> with a starting severity score of <span className="font-bold text-white">{aiAnalysis.severity}/10</span>. It will be routed to the appropriate department.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-card-border rounded-xl font-semibold hover:bg-white/5 transition-colors">
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary text-navy rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                  ) : (
                    <><Upload className="w-5 h-5" /> Submit Report</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <CheckCircle2 className="w-12 h-12 text-primary relative z-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Report Submitted!</h2>
              <p className="text-text-secondary text-lg max-w-sm mx-auto mb-8">
                Thank you for being an active citizen. Your report has been logged and authorities have been notified.
              </p>
              <p className="text-primary font-medium flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to Live Map...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
