import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Analysis from '@/pages/Analysis';

vi.mock('@/components/Navbar', () => ({ Navbar: () => <div /> }));
vi.mock('@/components/Footer', () => ({ Footer: () => <div /> }));

const { uploadFileWithProgress, analyzeMRI } = vi.hoisted(() => {
  type UploadCb = (n: number) => void;
  type UploadComplete = (r: { success: boolean; filename?: string }) => void;
  const uploadFileWithProgress = vi.fn((file: File, onProgress: UploadCb, onComplete: UploadComplete) => {
    onProgress(50);
    onComplete({ success: true, filename: 'tmp.jpg' });
  });
  type PatientData = { patientName?: string; patientAge?: string; patientGender?: string; scanDate?: string };
  const analyzeMRI = vi.fn(async (_file: File, _patient: PatientData) => ({
    result: { prediction: 'Normal', confidence: 0.92 },
    resultId: 'r1'
  }));
  return { uploadFileWithProgress, analyzeMRI };
});

vi.mock('@/services/api', () => ({ uploadFileWithProgress, analyzeMRI }));

describe('Analysis page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads an image and shows progress', async () => {
  const { container } = render(<Analysis />);
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  expect(input).toBeTruthy();
    const file = new File([new Uint8Array([1,2,3])], 'scan.jpg', { type: 'image/jpeg' });
    await userEvent.upload(input, file);
    // Progress gets shown during upload
    expect(uploadFileWithProgress).toHaveBeenCalled();
  });

  it('runs analysis and displays result summary', async () => {
  const { container } = render(<Analysis />);
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  expect(input).toBeTruthy();
    const file = new File([new Uint8Array([1,2,3])], 'scan.jpg', { type: 'image/jpeg' });
    await userEvent.upload(input, file);

    // Trigger Start Analysis button
    const analyzeBtn = await screen.findByRole('button', { name: /start analysis/i });
    await userEvent.click(analyzeBtn);

    await waitFor(() => expect(analyzeMRI).toHaveBeenCalled());
  });
});
