import { useEffect } from "react";

export default function Seo({ title, description, structuredData }) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute("content");
    const meta = descriptionMeta ?? document.createElement("meta");

    document.title = title;
    meta.setAttribute("name", "description");
    meta.setAttribute("content", description);
    if (!descriptionMeta) document.head.append(meta);

    let schemaScript;
    if (structuredData) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.textContent = JSON.stringify(structuredData).replace(/</g, "\\u003c");
      document.head.append(schemaScript);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription !== null) {
        descriptionMeta.setAttribute("content", previousDescription);
      } else {
        meta.remove();
      }
      schemaScript?.remove();
    };
  }, [description, structuredData, title]);

  return null;
}
