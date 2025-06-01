import { useTranslation } from "react-i18next";

import { ThemeController } from "@/components/ThemeController.tsx";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="navbar justify-between bg-base-100 shadow-sm border-b border-base-content/20 min-h-[55px] z-10">
      <div className="ml-2">
        <a className="flex items-center gap-1 text-xl font-bold" href="/">
          <img src="/chatbot.png" alt="" className="w-8 h-8 rounded-full" />
          Ollaix
        </a>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="btn btn-ghost h-9"
          onClick={() =>
            (
              document.getElementById("pricing_modal") as HTMLDialogElement
            ).showModal()
          }
        >
          {t("header.pricing.button")}
        </button>
        <ThemeController />
      </div>
      <dialog id="pricing_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("dialog.title")}</h3>
          <p className="py-4">
            {t("dialog.description")}
          </p>
          <p>
            {t("dialog.code")}
            <a
              href="https://github.com/Macktireh/ollaix"
              target="_blank"
              rel="noreferrer"
              className="link link-primary"
            >
              GitHub
            </a>
            .
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">{t("dialog.close")}</button>
            </form>
          </div>
        </div>
      </dialog>
    </header>
  );
};
