"use client";

import React, { useEffect, useRef } from "react";
import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";
import { createRoot, Root } from "react-dom/client";
import { Button } from "@/components/ui/button";

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

    // Derive the Component type from the editor instance
    type GjsComponent = InstanceType<typeof editor.DomComponents.Component>;
    type GjsComponentView = InstanceType<typeof editor.DomComponents.ComponentView>;

    // --- Shadcn UI Button Integration ---

    // 1. Define a new GrapesJS component type for our React Button
    editor.DomComponents.addType("react-button", {
      // The model defines the component's data structure and behavior
      model: {
        defaults: {
          // Traits are the component's editable properties in the sidebar
          traits: [
            { type: "text", label: "Text", name: "buttonText", changeProp: 1 },
            {
              type: "select",
              label: "Variant",
              name: "variant",
              changeProp: 1,
              options: [
                { value: "default", name: "Default" },
                { value: "destructive", name: "Destructive" },
                { value: "outline", name: "Outline" },
                { value: "secondary", name: "Secondary" },
                { value: "ghost", name: "Ghost" },
                { value: "link", name: "Link" },
              ],
            },
          ],
          // Default props for the React component
          buttonText: "Click me",
          variant: "default",
          // Add some padding to the wrapper element for easier selection
          attributes: { style: "display: inline-block; padding: 10px;" },
        },
        // This function is called when a property (like a trait) changes
        updated(this: GjsComponent, property: string) {
          if (["buttonText", "variant"].includes(property)) {
            this.view?.render();
          }
        },
      },
      // The view handles how the component is rendered in the editor
      view: {
        reactRoot: null as Root | null,
        onRender(this: GjsComponentView & { reactRoot: Root | null }, { el }: { el: HTMLElement }) {
          const { buttonText, variant } = this.model.props();
          if (!this.reactRoot) {
            this.reactRoot = createRoot(el);
          }
          this.reactRoot.render(<Button variant={variant}>{buttonText}</Button>);
        },
        onRemove(this: GjsComponentView & { reactRoot: Root | null }) {
          this.reactRoot?.unmount();
        },
      },
    });

    // 2. Add a block for our new React component to the Block Manager
    editor.BlockManager.add("react-button-block", {
      label: "React Button",
      category: "React Components",
      content: { type: "react-button" },
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
