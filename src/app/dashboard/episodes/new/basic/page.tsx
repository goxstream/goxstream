"use client";

import { useEpisodeForm } from "../context/episode-form-context";
import { BasicInfoStep } from "../components/basic-info-step";
import { StudioFooterNav } from "../components/studio-footer-nav";

export default function BasicInfoPage() {
  const { basicData, handleBasicChange } = useEpisodeForm();

  return (
    <>
      <BasicInfoStep formData={basicData} onChange={handleBasicChange} />
      <StudioFooterNav />
    </>
  );
}
