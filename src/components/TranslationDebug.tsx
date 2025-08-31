import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

const TranslationDebug: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 rounded p-2 text-xs">
      <div>
        <strong>Locale:</strong> {i18n.language}
      </div>
      <div>
        <strong>Path:</strong> {router.asPath}
      </div>
      <div>
        <strong>Test:</strong> {t("auth.login")}
      </div>
    </div>
  );
};

export default TranslationDebug;
