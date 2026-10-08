"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  function toggleMenu() {
    if (open && menuRef.current?.contains(document.activeElement))
      openerRef.current?.focus();
    setOpen(!open);
  }

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    if (open)
      menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    function closeMenu() {
      if (menuRef.current?.contains(document.activeElement))
        openerRef.current?.focus();
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape") closeMenu();
      if (event.key === "Tab") {
        const items =
          menuRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        const first = items?.[0];
        const last = items?.[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    function handleResize() {
      if (window.innerWidth > 1024) closeMenu();
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  useEffect(() => {
    function updateHeader() {
      document.body.classList.toggle("affix", window.scrollY > 50);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
    return () => {
      window.removeEventListener("scroll", updateHeader);
      document.body.classList.remove("affix");
    };
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="birdseye-header">
          <div>
            <div className="container">
              <div className="logo">
                <span className="wsite-logo">
                  <span className="wsite-title-placeholder">{"\u00a0"}</span>
                  <span className="tw:hidden!">
                    <span className="tw:hidden!">the matrix</span>
                  </span>
                </span>
              </div>
              <div aria-label="Main navigation" className="nav desktop-nav">
                <ul>
                  <li className="wsite-menu-item-wrap">
                    <Link className="wsite-menu-item" href="/">
                      Home
                    </Link>
                  </li>
                </ul>
              </div>
              <button
                ref={openerRef}
                aria-controls="navMobile"
                aria-expanded={open}
                aria-label="Menu"
                className="hamburger"
                onClick={toggleMenu}
                type="button"
              >
                <span />
              </button>
            </div>
          </div>
        </div>
        {children}
      </div>
      <div
        ref={menuRef}
        aria-label="Main navigation"
        className="nav mobile-nav"
        id="navMobile"
        inert={!open}
      >
        <button
          aria-controls="navMobile"
          aria-expanded={open}
          aria-label="Menu"
          className="hamburger"
          onClick={toggleMenu}
          type="button"
        >
          <span />
        </button>
        <ul>
          <li className="wsite-menu-item-wrap">
            <Link className="wsite-menu-item" href="/">
              Home
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
