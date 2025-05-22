
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About NeurAI Detect</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Using advanced AI to transform brain tumor diagnostics with speed, accuracy, and reliability.
            </p>
          </div>
          
          {/* Mission Statement */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  NeurAI Detect was founded with a clear mission: to improve brain tumor diagnostics through artificial intelligence, making accurate detection faster and more accessible to healthcare providers worldwide.
                </p>
                <p className="text-gray-700 mb-4">
                  We believe that AI should support, not replace, medical professionals. Our system works alongside radiologists, neurologists, and oncologists, providing them with powerful analytical tools to enhance their diagnostic capabilities.
                </p>
                <p className="text-gray-700">
                  By combining cutting-edge machine learning techniques with medical expertise, we aim to improve patient outcomes through earlier detection and more precise tumor classification.
                </p>
              </div>
              <div className="bg-neuraiPattern rounded-xl p-8">
                <div className="bg-white/90 p-6 rounded-lg shadow-md backdrop-blur-sm">
                  <div className="text-3xl font-bold text-neuraiBlue mb-4">90%+</div>
                  <p className="text-gray-700 font-medium">Tumor detection accuracy</p>
                  
                  <div className="border-t border-gray-200 my-4"></div>
                  
                  <div className="text-3xl font-bold text-neuraiBlue mb-4">85%+</div>
                  <p className="text-gray-700 font-medium">Classification accuracy</p>
                  
                  <div className="border-t border-gray-200 my-4"></div>
                  
                  <div className="text-3xl font-bold text-neuraiBlue mb-4">&lt;3 min</div>
                  <p className="text-gray-700 font-medium">Average analysis time</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Technology Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Technology</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                NeurAI Detect leverages state-of-the-art deep learning algorithms to analyze MRI scans and detect potential brain tumors with high accuracy.
              </p>
            </div>
            
            <Tabs defaultValue="howItWorks" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="howItWorks">How It Works</TabsTrigger>
                <TabsTrigger value="accuracy">Accuracy & Validation</TabsTrigger>
                <TabsTrigger value="research">Research & Development</TabsTrigger>
              </TabsList>
              
              <TabsContent value="howItWorks">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      step: "1",
                      title: "MRI Scan Upload",
                      description: "Healthcare providers upload patient MRI scans through our secure platform."
                    },
                    {
                      step: "2",
                      title: "AI Analysis",
                      description: "Our deep learning algorithms analyze the scans, checking for anomalies across multiple slices."
                    },
                    {
                      step: "3",
                      title: "Results & Diagnosis",
                      description: "Detailed results are provided with tumor detection, classification, and confidence scores."
                    }
                  ].map((item, index) => (
                    <Card key={index} className="overflow-hidden border-t-4 border-t-neuraiBlue">
                      <CardContent className="p-6">
                        <div className="w-10 h-10 rounded-full bg-neuraiBlue/10 text-neuraiBlue flex items-center justify-center font-bold mb-4">
                          {item.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-700">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <h4 className="text-neuraiBlue font-medium mb-1">Neural Network Architecture</h4>
                      <p className="text-gray-700 text-sm">Custom-designed convolutional neural network with 3D spatial awareness specifically optimized for MRI scan analysis</p>
                    </div>
                    <div>
                      <h4 className="text-neuraiBlue font-medium mb-1">Training Dataset</h4>
                      <p className="text-gray-700 text-sm">Over 100,000 anonymized MRI scans from diverse patient populations with expert annotations</p>
                    </div>
                    <div>
                      <h4 className="text-neuraiBlue font-medium mb-1">Supported MRI Types</h4>
                      <p className="text-gray-700 text-sm">T1, T1C, T2, FLAIR, DWI sequences from all major MRI manufacturers</p>
                    </div>
                    <div>
                      <h4 className="text-neuraiBlue font-medium mb-1">Processing Infrastructure</h4>
                      <p className="text-gray-700 text-sm">HIPAA-compliant cloud computing with dedicated GPUs for fast, secure processing</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="accuracy">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Methodology</h3>
                    <p className="text-gray-700 mb-4">
                      Our system undergoes rigorous testing using a combination of cross-validation techniques and external validation datasets to ensure reliable performance across diverse patient populations.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Every algorithm update is validated against multiple independent test sets before being deployed to production. Our validation process includes:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                      <li>Multi-institutional blind testing</li>
                      <li>Comparison against consensus expert readings</li>
                      <li>Statistical performance verification</li>
                      <li>Edge case analysis</li>
                    </ul>
                    <p className="text-gray-700">
                      Performance metrics are continuously monitored in real-world usage to ensure consistent quality.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Detection Accuracy</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Sensitivity</span>
                              <span className="font-medium">94.2%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-neuraiBlue h-2 rounded-full" style={{ width: "94.2%" }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Specificity</span>
                              <span className="font-medium">91.8%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-neuraiBlue h-2 rounded-full" style={{ width: "91.8%" }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Accuracy</span>
                              <span className="font-medium">92.7%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-neuraiBlue h-2 rounded-full" style={{ width: "92.7%" }}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Classification Accuracy</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Glioma</span>
                            <span className="font-medium">89.3%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Meningioma</span>
                            <span className="font-medium">87.6%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pituitary</span>
                            <span className="font-medium">92.1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Metastatic</span>
                            <span className="font-medium">85.4%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="research">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Initiatives</h3>
                    <p className="text-gray-700 mb-4">
                      Our team actively contributes to the advancement of AI in medical imaging through ongoing research initiatives and collaborations with leading academic institutions.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">Multi-modal MRI Analysis</h4>
                          <p className="text-sm text-gray-700">
                            Research on combining various MRI sequence types for improved detection sensitivity and specificity.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">Explainable AI Methods</h4>
                          <p className="text-sm text-gray-700">
                            Developing techniques to make neural network decisions more transparent to medical professionals.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">Longitudinal Tumor Tracking</h4>
                          <p className="text-sm text-gray-700">
                            Advanced techniques for monitoring tumor progression over time from sequential scans.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">Transfer Learning from Limited Data</h4>
                          <p className="text-sm text-gray-700">
                            Methods to adapt neural networks to detect rare tumor types with limited training examples.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Publications</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Deep Learning for Automated Brain Tumor Classification from Multi-sequence MRI",
                          authors: "Chen S, Park M, Rodriguez A, et al.",
                          journal: "Journal of Medical Imaging",
                          year: "2023"
                        },
                        {
                          title: "Attention-based Neural Networks for Improved Glioma Subtyping",
                          authors: "Zhang L, Wilson J, Kumar D, et al.",
                          journal: "Medical Image Analysis",
                          year: "2022"
                        },
                        {
                          title: "Explainable AI for Radiologists: Visualizing Detection Pathways in Brain MRI Analysis",
                          authors: "Park M, Thompson E, Johnson A, et al.",
                          journal: "European Radiology",
                          year: "2022"
                        }
                      ].map((paper, index) => (
                        <div key={index} className="border-l-4 border-neuraiBlue pl-4 py-1">
                          <p className="font-medium text-gray-900">{paper.title}</p>
                          <p className="text-sm text-gray-700">{paper.authors}</p>
                          <p className="text-sm text-gray-500">{paper.journal}, {paper.year}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button variant="outline" className="border-neuraiBlue text-neuraiBlue">
                        View All Publications
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>
          
          {/* Regulatory Information */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Regulatory Information</h2>
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="rounded-full w-16 h-16 bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">FDA Clearance</h3>
                  <p className="text-center text-gray-700 text-sm">
                    NeurAI Detect has received FDA clearance as a clinical decision support tool for radiologists.
                  </p>
                </div>
                <div className="p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="rounded-full w-16 h-16 bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliance</h3>
                  <p className="text-center text-gray-700 text-sm">
                    Our platform meets all requirements for HIPAA compliance, ensuring patient data security.
                  </p>
                </div>
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Certifications</h3>
                  <p className="text-center text-gray-700 text-sm">
                    CE Mark certified for use in European healthcare markets and approved in 28+ countries.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* FAQ & CTA Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-neuraiBlue to-neuraiPurple rounded-xl p-8 text-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Ready to Transform Tumor Diagnostics?</h2>
                <p className="max-w-2xl mx-auto">
                  Join leading healthcare institutions already benefiting from NeurAI Detect's advanced AI capabilities.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-white text-neuraiBlue hover:bg-gray-100">
                  Request a Demo
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
