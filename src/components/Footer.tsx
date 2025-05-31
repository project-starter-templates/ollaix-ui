export function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center text-base-content p-2">
      <aside>
        <ul className="flex justify-center items-center gap-2 text-xs text-base-content/70">
          <li>
            <img
              src="https://macktireh.dev/images/mack.png"
              alt="Mack"
              width="20"
              height="20"
              className="rounded-full border-2 border-primary/20"
            />
          </li>
          <li>
            Created by{" "}
            <a
              href="https://macktireh.dev"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Macktireh
            </a>{" "}
            ~ Ollaix © {new Date().getFullYear()}
          </li>
        </ul>
      </aside>
    </footer>
  );
}
