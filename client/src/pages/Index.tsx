
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import heroImage from '../../public/hero.jpg'; // Ensure this path is correct

const Index = () => {
  const features = [
    {
      title: '99% AI Accuracy',
      description: 'Our advanced neural networks deliver industry-leading 99% accuracy in brain tumor detection, verified through rigorous clinical trials.',
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      title: 'Fast Results',
      description: 'Get comprehensive analysis in under 3 minutes, allowing for faster clinical decisions and reduced patient waiting time.',
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    {
      title: 'Multi-Tumor Classification',
      description: 'Accurately identifies and classifies multiple tumor types including Meningioma, Glioma, Pituitary, and more.',
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      )
    },
    {
      title: 'Seamless Integration',
      description: 'Easily integrates with your existing PACS, EMR, and hospital information systems for a unified workflow.',
      icon: (
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
      )
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload MRI Scans',
      description: 'Securely upload DICOM or NIfTI format brain MRI scans through our intuitive interface.',
      delay: '0'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our advanced neural network analyzes the scans, identifying potential abnormalities with precise measurements.',
      delay: '100'
    },
    {
      number: '03',
      title: 'Detailed Results',
      description: 'Receive comprehensive reports with visual heatmaps highlighting areas of concern and classification of findings.',
      delay: '200'
    }
  ];

  const testimonials = [
    {
      quote: "NeurAI Detect has transformed our radiology department's workflow. The accuracy and speed of tumor detection allows us to prioritize urgent cases and improve patient outcomes.",
      author: "Dr. Sarah Johnson",
      title: "Chief of Neuroradiology, Memorial Hospital",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "The detailed classification of different tumor types has been incredibly valuable for treatment planning. NeurAI Detect has become an essential tool in our diagnostic process.",
      author: "Dr. Michael Chen",
      title: "Neurosurgeon, University Medical Center",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="neuraiPattern py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                AI-Powered Brain Tumor Detection <span className="text-primary">for Healthcare Professionals</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                NeurAI Detect uses advanced neural networks to provide fast, accurate, and reliable brain tumor detection and classification from MRI scans.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/analysis">
                  <Button className="w-full sm:w-auto text-lg py-6 px-8">
                    Try Demo Analysis
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="w-full sm:w-auto text-lg py-6 px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full animate-pulse-gentle"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
                <img 
                  src={heroImage} 
                  alt="Brain MRI scan with AI analysis overlay" 
                  className="rounded-xl shadow-xl relative z-10 animate-float w-full lg:w-full max-w-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl text-muted-foreground mb-8">Trusted by leading medical institutions</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'Mass General Hospital', 'UCSF Medical Center'].map((name) => (
              <div key={name} className="text-muted-foreground font-semibold text-lg md:text-xl">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive brain tumor detection with industry-leading accuracy and speed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-feature">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes it easy to upload scans and receive accurate results in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl shadow-md p-6 relative overflow-hidden transition-all hover:shadow-lg"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <span className="block text-5xl font-bold text-primary/10">{step.number}</span>
                <h3 className="text-xl font-semibold text-foreground mt-2 mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                    <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/analysis">
              <Button>
                Try Demo Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Medical Professionals Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from healthcare professionals who are using NeurAI Detect in their clinical practice.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted rounded-xl p-8 relative">
              <svg 
                className="w-16 h-16 text-primary/20 absolute top-4 left-4" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 mb-6 md:mb-0 md:mr-6">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-foreground text-lg italic mb-4">{testimonials[currentTestimonial].quote}</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonials[currentTestimonial].author}</p>
                    <p className="text-muted-foreground">{testimonials[currentTestimonial].title}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    onClick={() => setCurrentTestimonial(index)}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your brain tumor diagnostics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join leading medical institutions in using NeurAI Detect to improve diagnostic accuracy and patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login">
              <Button className="bg-white text-primary hover:bg-gray-100 text-lg py-6 px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg py-6 px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
