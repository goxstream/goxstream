"use client";

import { useState } from "react";
import { SubtitleHeader } from "./components/subtitle-header";
import { SubtitleLanguageMatrix } from "./components/subtitle-language-matrix";
import { SubtitleUploaderCard } from "./components/subtitle-uploader-card";
import { MOCK_SUBTITLE_COVERAGE } from "../constants";

export default function SubtitlesPage() {
  const [coverageList] = useState(MOCK_SUBTITLE_COVERAGE);

  const scrollToUploader = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 p-6">
      <SubtitleHeader onUploadClick={scrollToUploader} />

      <SubtitleLanguageMatrix coverageList={coverageList} />

      <SubtitleUploaderCard />
    </div>
  );
}
