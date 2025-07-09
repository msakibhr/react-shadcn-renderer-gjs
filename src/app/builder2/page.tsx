"use client";

import React, { useEffect, useRef, useState } from "react";
import "grapesjs/dist/css/grapes.min.css";
import "../globals.css";
import grapesjs from "grapesjs";
import { createRoot, Root } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type EditorInstance = ReturnType<typeof grapesjs.init>;

const BuilderPage = () => {
  const [mounted, setMounted] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<EditorInstance | null>(null);

  useEffect(() => {
    setMounted(true);
    // Add font-awesome to head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (editorInstanceRef.current || !editorContainerRef.current) {
      return;
    }

    // Collect all stylesheets from the parent document to inject into the canvas iframe
    const styleHrefs: string[] = [];
    const styleSheets = Array.from(document.styleSheets);
    for (const sheet of styleSheets) {
      if (sheet.href) {
        styleHrefs.push(sheet.href);
      }
    }

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      blockManager: {
        appendTo: "#blocks",
        blocks: [
          {
            id: "section",
            label: "Section",
            // The content can be a component definition
            content: {
              // We use the `wrapper` component as it's the default container
              type: 'wrapper',
              // Make it droppable
              droppable: true,
              // Default styles for the section
              style: {
                padding: '2rem',
                'min-height': '100px',
                'border': '2px dashed #ccc',
              },
              // Add some default inner components
              components: '<h1>This is a simple title</h1><div>This is just a Lorem text...</div>'
            },
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
          // A new block for a droppable container
          {
            id: 'container',
            label: 'Container',
            content: {
              type: 'container', // This will correspond to a new component type
            },
            category: 'Layout',
          },
        ],
      },
      layerManager: {
        appendTo: '#layers-container',
      },
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'General',
            open: false,
            buildProps: [
              'float',
              'display',
              'position',
              'top',
              'right',
              'left',
              'bottom',
            ],
            properties: [
              {
                id: 'float',
                type: 'radio',
                defaults: 'none',
                list: [
                  { value: 'none', className: 'fa fa-times' },
                  { value: 'left', className: 'fa fa-align-left' },
                  { value: 'right', className: 'fa fa-align-right' },
                ],
              },
              {
                property: 'position',
                type: 'select',
                defaults: 'static',
                list: [
                  { value: 'static', name: 'Static' },
                  { value: 'relative', name: 'Relative' },
                  { value: 'absolute', name: 'Absolute' },
                  { value: 'fixed', name: 'Fixed' },
                ],
              },
            ],
          },
          {
            name: 'Dimension',
            open: false,
            buildProps: [
              'width',
              'height',
              'max-width',
              'min-height',
              'margin',
              'padding',
            ],
            properties: [
              {
                id: 'width',
                type: 'integer',
                units: ['px', '%', 'em', 'rem', 'vw'],
                defaults: 'auto',
              },
              {
                id: 'height',
                type: 'integer',
                units: ['px', '%', 'em', 'rem', 'vh'],
                defaults: 'auto',
              },
              {
                id: 'max-width',
                type: 'integer',
                units: ['px', '%', 'em', 'rem', 'vw'],
                defaults: 'none',
              },
              {
                id: 'min-height',
                type: 'integer',
                units: ['px', '%', 'em', 'rem', 'vh'],
                defaults: '0',
              },
              {
                id: 'margin',
                property: 'margin',
                type: 'composite',
                properties: [
                  { id: 'margin-top', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                  { id: 'margin-right', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                  { id: 'margin-bottom', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                  { id: 'margin-left', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                ],
              },
              {
                id: 'padding',
                property: 'padding',
                type: 'composite',
                properties: [
                  { id: 'padding-top', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                  { id: 'padding-right', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                  { id: 'padding-bottom', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                  { id: 'padding-left', type: 'integer', units: ['px', '%', 'em', 'rem'] },
                ],
              },
            ],
          },
          {
            name: 'Typography',
            open: false,
            buildProps: [
              'font-family',
              'font-size',
              'font-weight',
              'letter-spacing',
              'color',
              'line-height',
              'text-align',
              'text-decoration',
              'text-shadow',
            ],
            properties: [
              {
                id: 'font-family',
                type: 'select',
                defaults: 'Arial, sans-serif',
                list: [
                  { value: 'Arial, sans-serif', name: 'Arial' },
                  { value: 'Helvetica, sans-serif', name: 'Helvetica' },
                  { value: 'Georgia, serif', name: 'Georgia' },
                  { value: 'Times New Roman, serif', name: 'Times New Roman' },
                  { value: 'Courier New, monospace', name: 'Courier New' },
                ],
              },
              {
                id: 'font-size',
                type: 'integer',
                units: ['px', 'em', 'rem', '%'],
                defaults: '16px',
              },
              {
                id: 'font-weight',
                type: 'select',
                defaults: 'normal',
                list: [
                  { value: 'normal', name: 'Normal' },
                  { value: 'bold', name: 'Bold' },
                  { value: 'bolder', name: 'Bolder' },
                  { value: 'lighter', name: 'Lighter' },
                  { value: '100', name: '100' },
                  { value: '200', name: '200' },
                  { value: '300', name: '300' },
                  { value: '400', name: '400' },
                  { value: '500', name: '500' },
                  { value: '600', name: '600' },
                  { value: '700', name: '700' },
                  { value: '800', name: '800' },
                  { value: '900', name: '900' },
                ],
              },
              {
                id: 'line-height',
                type: 'integer',
                units: ['px', 'em', 'rem', '%'],
                defaults: 'normal',
              },
              {
                id: 'text-align',
                type: 'radio',
                defaults: 'left',
                list: [
                  { value: 'left', name: 'Left', className: 'fa fa-align-left' },
                  { value: 'center', name: 'Center', className: 'fa fa-align-center' },
                  { value: 'right', name: 'Right', className: 'fa fa-align-right' },
                  { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' },
                ],
              },
              {
                id: 'text-decoration',
                type: 'radio',
                defaults: 'none',
                list: [
                  { value: 'none', name: 'None', className: 'fa fa-times' },
                  { value: 'underline', name: 'Underline', className: 'fa fa-underline' },
                  { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough' },
                ],
              },
            ],
          },
          {
            name: 'Decorations',
            open: false,
            buildProps: [
              'opacity',
              'background-color',
              'border-radius',
              'border',
              'box-shadow',
              'background',
            ],
            properties: [
              {
                id: 'opacity',
                type: 'slider',
                defaults: 1,
                step: 0.01,
                max: 1,
                min: 0,
              },
              {
                id: 'border-radius',
                type: 'integer',
                units: ['px', '%', 'em', 'rem'],
                defaults: '0',
              },
              {
                id: 'border',
                property: 'border',
                type: 'composite',
                properties: [
                  { id: 'border-width', type: 'integer', units: ['px', 'em', 'rem'] },
                  {
                    id: 'border-style',
                    type: 'select',
                    list: [
                      { value: 'none', name: 'None' },
                      { value: 'solid', name: 'Solid' },
                      { value: 'dotted', name: 'Dotted' },
                      { value: 'dashed', name: 'Dashed' },
                      { value: 'double', name: 'Double' },
                      { value: 'groove', name: 'Groove' },
                      { value: 'ridge', name: 'Ridge' },
                      { value: 'inset', name: 'Inset' },
                      { value: 'outset', name: 'Outset' },
                    ],
                  },
                  { id: 'border-color', type: 'color' },
                ],
              },
            ],
          },
          {
            name: 'Extra',
            open: false,
            buildProps: ['transition', 'perspective', 'transform'],
            properties: [
              {
                id: 'transition',
                property: 'transition',
                type: 'stack',
                preview: false,
                full: true,
              },
              {
                id: 'transform',
                property: 'transform',
                type: 'stack',
                preview: false,
                full: true,
              },
            ],
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
      // Pass the collected stylesheets to the canvas
      canvas: {
        styles: styleHrefs,
      },
    });

    // Derive the Component type from the editor instance
    type GjsComponent = InstanceType<typeof editor.DomComponents.Component>;
    type GjsComponentView = InstanceType<typeof editor.DomComponents.ComponentView>;

    // --- Container Component ---
    // This is a basic component that can contain other components.
    editor.DomComponents.addType('container', {
      model: {
        defaults: {
          // Make it droppable
          droppable: true,
          style: {
            'min-height': '50px',
            border: '1px solid #ddd',
            padding: '10px',
          },
        },
      },
    });

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

    // --- Shadcn UI Alert Integration ---
    editor.DomComponents.addType("react-alert", {
      model: {
        defaults: {
          traits: [
            {
              type: "select",
              label: "Variant",
              name: "variant",
              changeProp: 1,
              options: [
                { value: "default", name: "Default" },
                { value: "destructive", name: "Destructive" },
              ],
            },
            { type: "text", label: "Title", name: "alertTitle", changeProp: 1 },
            {
              type: "text",
              label: "Description",
              name: "alertDescription",
              changeProp: 1,
            },
          ],
          variant: "default",
          alertTitle: "Heads up!",
          alertDescription: "You can add components to the canvas.",
          attributes: { style: "padding: 10px;" },
        },
        updated(this: GjsComponent, property: string) {
          if (
            ["variant", "alertTitle", "alertDescription"].includes(property)
          ) {
            this.view?.render();
          }
        },
      },
      view: {
        reactRoot: null as Root | null,
        onRender(
          this: GjsComponentView & { reactRoot: Root | null },
          { el }: { el: HTMLElement }
        ) {
          const { variant, alertTitle, alertDescription } = this.model.props();
          if (!this.reactRoot) {
            this.reactRoot = createRoot(el);
          }
          this.reactRoot.render(
            <Alert variant={variant}>
              <AlertTitle>{alertTitle}</AlertTitle>
              <AlertDescription>{alertDescription}</AlertDescription>
            </Alert>
          );
        },
        onRemove(this: GjsComponentView & { reactRoot: Root | null }) {
          this.reactRoot?.unmount();
        },
      },
    });

    editor.BlockManager.add("react-alert-block", {
      label: "React Alert",
      category: "React Components",
      content: { type: "react-alert" },
    });

    // --- Shadcn UI Badge Integration ---
    editor.DomComponents.addType("react-badge", {
      model: {
        defaults: {
          traits: [
            {
              type: "select",
              label: "Variant",
              name: "variant",
              changeProp: 1,
              options: [
                { value: "default", name: "Default" },
                { value: "secondary", name: "Secondary" },
                { value: "destructive", name: "Destructive" },
                { value: "outline", name: "Outline" },
              ],
            },
            { type: "text", label: "Text", name: "badgeText", changeProp: 1 },
          ],
          variant: "default",
          badgeText: "Badge",
          attributes: { style: "padding: 10px; display: inline-block;" },
        },
        updated(this: GjsComponent, property: string) {
          if (["variant", "badgeText"].includes(property)) {
            this.view?.render();
          }
        },
      },
      view: {
        reactRoot: null as Root | null,
        onRender(
          this: GjsComponentView & { reactRoot: Root | null },
          { el }: { el: HTMLElement }
        ) {
          const { variant, badgeText } = this.model.props();
          if (!this.reactRoot) {
            this.reactRoot = createRoot(el);
          }
          this.reactRoot.render(<Badge variant={variant}>{badgeText}</Badge>);
        },
        onRemove(this: GjsComponentView & { reactRoot: Root | null }) {
          this.reactRoot?.unmount();
        },
      },
    });

    editor.BlockManager.add("react-badge-block", {
      label: "React Badge",
      category: "React Components",
      content: { type: "react-badge" },
    });

    editorInstanceRef.current = editor;

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [mounted]);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="flex h-screen">
      {/* Left Panel - Blocks */}
      <div className="w-1/5 bg-gray-100 border-r">
        <div className="p-4">
          <h3 className="font-bold mb-2">Blocks</h3>
          <div id="blocks"></div>
        </div>
      </div>
      
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        <div ref={editorContainerRef} className="flex-1"></div>
      </div>
      
      {/* Right Panel - Layers and Style Manager */}
      <div className="w-1/4 bg-gray-100 border-l flex flex-col">
        {/* Layers Panel */}
        <div className="flex-1 border-b">
          <div className="p-4">
            <h3 className="font-bold mb-2">Layers</h3>
            <div id="layers-container"></div>
          </div>
        </div>
        
        {/* Style Manager */}
        <div className="flex-1">
          <div className="p-4">
            <h3 className="font-bold mb-2">Style Manager</h3>
            <div id="styles-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
