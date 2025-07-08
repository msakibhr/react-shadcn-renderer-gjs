"use client";


import { useEffect, useRef } from "react";
import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";

type EditorInstance = ReturnType<typeof grapesjs.init>;

const BuilderPage = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<EditorInstance | null>(null);

  useEffect(() => {
    if (editorInstanceRef.current || !editorContainerRef.current) {
      return;
    }

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      blockManager: {
        appendTo: "#blocks",
        blocks: [
          {
            id: "section",
            label: "<b>Section</b>",
            attributes: { class: "gjs-block-section" },
            content: `<section>
                        <h1>This is a simple title</h1>
                        <div>This is just a Lorem text...</div>
                      </section>`,
          },
          {
            id: "text",
            label: "Text",
            content: '<div data-gjs-type="text">Insert your text here</div>',
          },
          {
            id: "image",
            label: "Image",
            select: true,
            content: { type: "image" },
            activate: true,
          },
        ],
      },
      storageManager: {
        type: "local",
        options: {
          local: { key: "gjs-nextjs-project" },
        },
      },
      panels: {
        defaults: [],
      },
    });

    editorInstanceRef.current = editor;

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex">
      <div id="blocks" className="w-1/4 bg-gray-200 p-4">
      </div>
      <div ref={editorContainerRef} className="w-3/4 bg-white"></div>
    </div>
  );
};

export default BuilderPage;

