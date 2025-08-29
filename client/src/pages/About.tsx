import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Confusion from "@/assets/images/confusion.png";
import scores from "@/assets/images/scores.png";
import ROC from "@/assets/images/roc.png";
import trainingHistory from "@/assets/images/traininghistory.png";
import ModelStats from "@/components/Stats";

// Model performance data

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Mastiskha
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Using advanced AI to transform brain tumor diagnostics with speed,
              accuracy, and reliability.
            </p>
          </div>

          {/* Mission Statement */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Performance Overview
                </h2>
                <p className="text-gray-700 mb-4">
                  The training process was effective, as shown by the consistent
                  increase in accuracy and decrease in loss over 14 epochs. This
                  indicates the model learned well and is not overfitting, with
                  a strong overall accuracy of 97.25%.
                </p>
                <p className="text-gray-700 mb-4">
                  The model is highly successful at differentiating tumor types.
                  The ROC curves show a perfect AUC of 1.00 for every class,
                  demonstrating its superior ability to distinguish between
                  meningioma, glioma, pituitary, and non-tumor cases. This is
                  supported by high precision, recall, and F1-scores for each
                  class, all above 0.95.
                </p>
                <p className="text-gray-700">
                  The confusion matrix confirms the model's low error rate. The
                  number of correct predictions is significantly higher than
                  misclassifications, showing the model's strong ability to
                  accurately identify each specific class.
                </p>
              </div>
              <div className="bg-neuraiPattern rounded-xl p-8">
                <div className="bg-white/90 p-6 rounded-lg shadow-md backdrop-blur-sm">
                  <div className="text-3xl font-bold text-neuraiBlue mb-4">
                    96.87%
                  </div>
                  <p className="text-gray-700 font-medium">
                    Tumor detection accuracy
                  </p>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="text-3xl font-bold text-neuraiBlue mb-4">
                    97.25%
                  </div>
                  <p className="text-gray-700 font-medium">
                    Classification accuracy
                  </p>

                  <div className="border-t border-gray-200 my-4"></div>

                  <div className="text-3xl font-bold text-neuraiBlue mb-4">
                    &lt;3 min
                  </div>
                  <p className="text-gray-700 font-medium">
                    Average analysis time
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Performance Metrices
              </h2>
            </div>

            <Tabs defaultValue="accuracy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="accuracy">
                  Accuracy & Validation
                </TabsTrigger>
                <TabsTrigger value="research">
                  Research & Development
                </TabsTrigger>
                <TabsTrigger value="stats">Model Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="accuracy">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <img src={ROC} alt="ROC Curves" />
                        <div className="mt-4">
                          <h4 className="font-bold text-center mb-1">
                            Receiver Operating Characteristic (ROC) Curves
                          </h4>
                          <p className="text-gray-700 text-sm text-center">
                            Our model achieved an AUC of 1.0 for all individual
                            classes (meningioma, glioma, notumor, pituitary) and
                            for the micro-average. This indicates that the model
                            is able to distinguish between the different classes
                            with almost perfect accuracy based on this metric.
                            The curves are all hugging the top-left corner of
                            the graph, which is the optimal position. The dashed
                            black line represents a random classifier (AUC =
                            0.5).
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <img src={scores} alt="ROC Curves" />
                        <div className="mt-4">
                          <h4 className="font-bold text-center mb-1">
                            Precision, Recall, and F1-score
                          </h4>
                          <p className="text-gray-700 text-sm ">
                            <b>Precision:</b> Our model has high precision for
                            all classes (above 0.95 for most), with "notumor"
                            and "pituitary" being particularly high, indicating
                            very few false positives.
                          </p>
                          <p className="text-gray-700 text-sm my-3">
                            <b>Recall:</b> Our model also shows high recall
                            across all classes, particularly for "notumor" and
                            "pituitary," indicating it correctly identifies
                            almost all instances of these classes.
                          </p>
                          <p className="text-gray-700 text-sm ">
                            <b>F1-score:</b> The F1-scores are also very high
                            (close to 0.98 for all classes), confirming the
                            model's balanced performance in identifying classes
                            correctly and comprehensively.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <img src={trainingHistory} alt="Training History" />
                      <div className="mt-4">
                        <h4 className="font-bold text-center mb-1">
                          Model Training History
                        </h4>
                        <h5 className="font-medium mb-1">
                          This image shows the model's performance during the
                          training process over 14 epochs.
                        </h5>
                        <p className="text-gray-700 text-sm">
                          <b>Model Accuracy:</b> The left plot shows both
                          training accuracy (<b>blue line</b>) and validation
                          accuracy (<b>orange line</b>).
                          <li>
                            {" "}
                            The training accuracy steadily increases and reaches
                            a high of about 99% by the final epoch.
                          </li>
                          <li>
                            The validation accuracy also increases and closely
                            follows the training accuracy, reaching a high of
                            over 96%.
                          </li>
                          <li>
                            The closeness between the training and validation
                            accuracy curves indicates that the model is learning
                            effectively and generalizing well to new, unseen
                            data, with no significant signs of overfitting.
                          </li>
                        </p>
                        <p className="text-gray-700 text-sm my-3">
                          <b>Model Loss:</b>The right plot shows the training
                          loss and validation loss.
                          <li>
                            {" "}
                            The training loss (blue line) decreases consistently
                            throughout training, indicating the model is getting
                            better at making correct predictions.
                          </li>
                          <li>
                            {" "}
                            The validation loss (orange line) also decreases,
                            mirroring the training loss trend, which again
                            suggests the model isn't overfitting. The validation
                            loss shows some minor fluctuations, but the overall
                            trend is a consistent decline.
                          </li>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <img src={Confusion} alt="Confusion Matrix" />
                      <div className="mt-4">
                        <h4 className="font-bold text-center mb-1">
                          Confusion Matrix
                        </h4>
                        <h5 className="font-medium mb-1">
                          The two heatmaps show the same data: the left one
                          shows raw counts, and the right one shows normalized
                          percentages.
                        </h5>
                        <div className="text-gray-700 text-sm">
                          <ul className="space-y-1 ml-4 list-disc">
                            <li>
                              <b>Rows:</b> Represent the true labels (the actual
                              class of the MRI).
                            </li>
                            <li>
                              <b>Columns:</b> Represent the predicted labels
                              (the class the model assigned).
                            </li>
                            <li>
                              <b>Diagonal Elements:</b> The numbers along the
                              main diagonal (e.g., 293 for meningioma, 277 for
                              glioma) represent the number of correct
                              predictions for each class.
                            </li>
                            <li>
                              <b>Off-Diagonal Elements:</b> The numbers off the
                              diagonal represent misclassifications.
                            </li>
                          </ul>

                          <h1 className="text-medium my-2">
                            <b>Count Matrix (Left):</b>
                          </h1>
                          <ul className="space-y-1 ml-4 list-disc">
                            <li>
                              <b>Meningioma:</b> 293 were correctly classified,
                              but 3 were mistaken for glioma, 2 for notumor, and
                              8 for pituitary.
                            </li>
                            <li>
                              <b>Glioma:</b> 277 were correct, but 18 were
                              mistaken for meningioma, and 5 for pituitary.
                            </li>
                            <li>
                              <b>Notumor:</b> 401 were correct, with only a few
                              misclassified.
                            </li>
                            <li>
                              <b>Pituitary:</b> 299 were correct, with only 1
                              misclassified as glioma.
                            </li>
                          </ul>

                          <h1 className="text-medium my-2">
                            <b>Normalized Matrix (Right):</b>
                          </h1>
                          <ul className="space-y-1 ml-4 list-disc">
                            <li>
                              This heatmap shows the same data as percentages of
                              the total for each true class. For instance, for
                              "meningioma," 96% were correctly identified.
                            </li>
                            <li>
                              The highest misclassification rate appears to be
                              glioma being misclassified as meningioma (6%), and
                              meningioma being misclassified as pituitary (3%).
                              These are minor errors given the overall high
                              accuracy.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="research">
                <div className="space-y-8">
                  {/* <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Research Initiatives
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Our team actively contributes to the advancement of AI in
                      medical imaging through ongoing research initiatives and
                      collaborations with leading academic institutions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Multi-modal MRI Analysis
                          </h4>
                          <p className="text-sm text-gray-700">
                            Research on combining various MRI sequence types for
                            improved detection sensitivity and specificity.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Explainable AI Methods
                          </h4>
                          <p className="text-sm text-gray-700">
                            Developing techniques to make neural network
                            decisions more transparent to medical professionals.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Longitudinal Tumor Tracking
                          </h4>
                          <p className="text-sm text-gray-700">
                            Advanced techniques for monitoring tumor progression
                            over time from sequential scans.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Transfer Learning from Limited Data
                          </h4>
                          <p className="text-sm text-gray-700">
                            Methods to adapt neural networks to detect rare
                            tumor types with limited training examples.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div> */}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Selected Publications
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "How Common Is a Brain Tumor",
                          authors:
                            "The Preston Robert Tisch Brain Tumor Center",
                          url: "https://tischbraintumorcenter.duke.edu/blog/how-common-brain-tumor",
                          year: "2024",
                        },
                        {
                          title:
                            "International patterns and trends in the brain cancer incidence and mortality: An observational study based on the global burden of disease",
                          authors: "Ilic, I. and Ilic, M.",
                          journal: "Heliyon",
                          year: "2023",
                          doi: "10.1016/j.heliyon.2023.e18222",
                        },
                        {
                          title:
                            "Deep Learning for Medical Image Processing: Overview, Challenges and the Future",
                          authors: "Razzak, M.I. and Naz, S. and Zaib, A.",
                          journal: "European Radiology",
                          year: "2018",
                          doi: "10.1007/978-3-319-65981-7_12",
                        },
                        {
                          title:
                            "Image Segmentation and Classification Using Neural Network",
                          authors: "F. Zohra and others",
                          journal: "arXiv preprint",
                          year: "2024",
                        },
                        {
                          title:
                            "A Hybrid Deep CNN Model for Brain Tumor Image Multi-Classification",
                          authors:
                            "S. Srinivasan and B. Babu Vimala and S. Mathivanan and others",
                          journal: "Scientific Reports",
                          year: "2024",
                        },
                        {
                          title:
                            "Brain Tumor Detection and Classification via VGG16-Based Deep Learning on MRI Imaging",
                          authors: "S. Aksoy",
                          journal: "Proceedings of [Conference Name]",
                          year: "2025",
                        },
                        {
                          title:
                            "Employing Deep Learning and Transfer Learning for Accurate Brain Tumor Detection",
                          authors:
                            "S. Mathivanan and S. Sonaimuthu and S. Murugesan and others",
                          journal: "Scientific Reports",
                          year: "2024",
                        },
                        {
                          title:
                            "Detection and Classification of Brain Tumor Using Hybrid Deep Learning Models",
                          authors:
                            "B. Babu Vimala and S. Srinivasan and S. Mathivanan and others",
                          journal: "Scientific Reports",
                          year: "2023",
                        },
                        {
                          title:
                            "Brain Tumor Detection from Images and Comparison with Transfer Learning Methods and 3-Layer CNN",
                          authors: "M. Khaliki and M. Başarslan",
                          journal: "Scientific Reports",
                          year: "2024",
                        },
                      ].map((paper, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-neuraiBlue pl-4 py-1"
                        >
                          <p className="font-medium text-gray-900">
                            {paper.title}
                          </p>
                          <p className="text-sm text-gray-700">
                            {paper.authors}
                          </p>
                          <p className="text-sm text-gray-500">
                            {paper.journal}, {paper.year}, {paper.doi},
                          </p>

                          <p className="text-sm text-gray-500">{paper.url}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats">
                <ModelStats />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
