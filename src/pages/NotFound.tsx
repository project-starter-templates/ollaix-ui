import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-4xl font-semibold text-primary">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          {t("404.page.title")}
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-base-content/70 sm:text-xl/8">
          {t("404.page.subtitle")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-primary text-primary-content px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t("404.page.goback")}
          </Link>
        </div>
      </div>
    </main>
  );
}
