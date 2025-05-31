import { useTranslation } from "react-i18next";

export function InitialMessage() {
  const { t } = useTranslation();

  return (
    <div className="w-[90%] text-center p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col gap-4 items-center">
        <img
          src="/chatbot.png"
          alt="Ollaix"
          width={100}
          height={100}
          className="rounded-full"
        />
        <p className="text-xl md:text-2xl font-semibold text-base-content mt-4">
          {t("initial.message.title")}
        </p>
        <p className="text-sm text-base-content/70">
          {t("initial.message.subtitle")}
        </p>
      </div>
    </div>
  );
}
