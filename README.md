# React Async Modal

A lightweight, type-safe, promise-based modal system for React.

This package provides three different modal patterns:

- `modal.add()` → Global modal system
- `ModalProvider` → Context-based modal system
- `ImperativeModal` → Ref-based modal system

Built with:

- React Hooks
- TypeScript
- Async/Await API
- `useSyncExternalStore`
- Zero dependencies

---

# Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Basic Modal Type](#basic-modal-type)
- [Create a Modal](#create-a-modal)
- [1. Usage Container Modal](#1-usage-container-modal)
- [2. Usage Provider Modal](#2-usage-provider-modal)
- [3. Usage Imperative Modal](#3-usage-imperative-modal)
- [Modal Options](#modal-options)
- [Animation Support](#animation-support)
- [How It Works](#how-it-works)
- [Architecture Comparison](#architecture-comparison)
- [Best Practices](#best-practices)
- [Example With MUI](#example-with-mui)
- [License](#license)

---


## Features

- Promise-based modal API
- Fully typed modal data and responses
- Multiple modal architectures
- Animation support with `outDelay`
- Lightweight and reusable
- No reducers
- No external state library
- React 19+
- TypeScript support
- Async/Await modal handling

---

# Installation

Install with npm:

```bash
npm install @paratco/async-modal
```

Install with yarn:

```bash
yarn add @paratco/async-modal
```

Install with pnpm:

```bash
pnpm add @paratco/async-modal
```

Install with bun:

```bash
bun add @paratco/async-modal
```

---

## Basic Modal Type

All modal systems use the same modal component contract.

```tsx
type AsyncModalProps<Response, Data> = {
  isVisible: boolean;
  dismissible: boolean;
  data?: Data;
  onClose: (result?: Response) => void;
};
```

---

# Create a Modal

```tsx
import type { AsyncModalProps } from "@paratco/async-modal";
import type { ReactElement } from "react";

export interface DataProps {
  value: string;
}

export default function MyModal({ dismissible, isVisible, onClose, data }:
AsyncModalProps<boolean, DataProps>): ReactElement {
  const handleClose = (): void => {
    if (dismissible) {
      onClose(false);
    }
  };

  const handleConfirm = (): void => {
    onClose(false);
  };

  return (
    <div 
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "12px",
        zIndex: 10,
        ...(isVisible === true ? {
          visibility: "visible",
          opacity: 1
        } : {
          visibility: "hidden",
          opacity: 0
        })
      }}
      onClick={() => {
        handleClose();
      }}
    >
      <div 
        style={{
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          backgroundColor: "white"
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <p>
          This is Container Modal
          {
            data?.value
          }
        </p>

        <button
          type="button" 
          onClick={() => {
            onClose(false);
          }}
        >
          <p>
            Cancel
          </p>
        </button>
        <button type="button" onClick={handleConfirm}>
          <p>
            Confirm
          </p>
        </button>
      </div>
    </div>
  );
}
```

# 1. Usage Container modal

A global modal architecture using `ModalContainer`.

Best for:

- App-wide dialogs
- Global confirms
- Notification modals

## Setup
Render `ModalContainer` once in your application.

```tsx
import { ModalContainer } from "@paratco/async-modal";

function MyComponent() {
  return (
    <>
      <ModalContainer />
    </>
  );
}
```

## Open Modal

```tsx
import { modal } from "@paratco/async-modal";
import { ConfirmModal } from "./ConfirmModal";

function MyComponent() {
  const showMyModal = async (): Promise<void> => {
    const result = await modal.add(
      MyModal
    , {
      data: {
        value: "this value is data this modal"
      },
      dismissible: true
    });

    console.log(`Container Modal result: ${result}`);
  };

  return (
    <>
      <ModalContainer />

      <Button
        variant="text"
        onClick={() => {
          void showMyModal();
        }}
      >
        Show Modal Container
      </Button>
    </>
  );
}
```

## With Animation Delay

```tsx
await modal.add(
  MyModal, 
  {
    outDelay: 300 //ms
  }
);
```

---

# 2. Usage Provider Modal

A provider-driven modal architecture using React Context.

Best for:

- Feature-scoped modals
- Modular applications
- Context-driven apps

## Setup

```tsx
import { ModalProvider } from "@paratco/async-modal";

function App() {
  return (
    <ModalProvider>
      <HomePage />
    </ModalProvider>
  );
}
```

## Open Modal

```tsx
import { useProviderModal } from "@paratco/async-modal";
import { ConfirmModal } from "./ConfirmModal";

function App() {
  const { show } = useProviderModal();

  const showMyModal = async (): Promise<void> => {
    const result = await show(
      MyModal
      , {
        dismissible: true
      }
    );

    console.log(`Provider Modal result: ${result}`);
  };

  return(
    <button
      type="button"
      onClick={() => {
        void showMyModal();
      }}
    >
      Show Provider Modal
    </button>
  );
}
```

## Default Provider Options

```tsx
<ModalProvider
  dismissible={false}
  outDelay={500}
>
  <App />
</ModalProvider>
```

These values become default options for all modals inside the provider.

---

# 3. Usage Imperative Modal

A ref-based modal architecture.

Best for:

- Local component workflows
- Independent modal instances
- Ref-based APIs

## Setup

```tsx
import { useRef } from "react";
import type { ReactElement } from "react";
import { Button } from "@mui/material";
import { ImperativeModal } from "@paratco/async-modal";
import type { ImperativeModalRef } from "@paratco/async-modal";
import MyModal from "./components/MyModal";

function App(): ReactElement {
  const ref = useRef<ImperativeModalRef<typeof MyModal>>(null);

  return (
    <React.Fragment>
      <ImperativeModal
        Modal={MyModal}
        ref={ref}
        dismissible={true}
      />

      <Button
        variant="contained"
        onClick={() => {
          void showModal();
        }}
      >
        Show Modal
      </Button>
    </React.Fragment>
  );
}

export default App;
```

## Open Modal

```tsx
const showModal = async (): Promise<void> => {
  const result = await ref.current?.api.show();

  console.log(`Imperative Modal result: ${result}`);
};
```

## Full Imperative Example

```tsx
import { useRef } from "react";
import type { ReactElement } from "react";
import { Button } from "@mui/material";
import { ImperativeModal } from "@paratco/async-modal";
import type { ImperativeModalRef } from "@paratco/async-modal";
import MyModal from "./components/MyModal";

function App(): ReactElement {
  const ref = useRef<ImperativeModalRef<typeof MyModal>>(null);

  const showModal = async (): Promise<void> => {
    const result = await ref.current?.api.show();

    console.log(`Imperative Modal result: ${result}`);
  };

  return (
    <React.Fragment>
      <ImperativeModal
        Modal={MyModal}
        ref={ref}
        dismissible={true}
      />

      <Button
        variant="contained"
        onClick={() => {
          void showModal();
        }}
      >
        Show Modal
      </Button>
    </React.Fragment>
  );
}

export default App;
```

---

# Modal Options

All modal systems support the same options.

| Option | Type | Description |
|---|---|---|
| `dismissible` | `boolean` | Allow dismiss modal |
| `outDelay` | `number` | Delay before unmount |
| `data` | `unknown` | Modal input data |

---

# Animation Support

Use `outDelay` for exit animations.

```tsx
await modal.add(ConfirmModal, {
  outDelay: 300
});
```

Inside modal:

```tsx
<div className={isVisible ? "fade-in" : "fade-out"}>
  Modal Content
</div>
```


Example CSS:

```css
.fade-in {
  opacity: 1;
  transition: opacity 0.3s;
}

.fade-out {
  opacity: 0;
  transition: opacity 0.3s;
}
```

# How It Works

## modal.add()


- Modal is stored globally
- `ModalContainer` subscribes to updates
- Modal renders dynamically
- `onClose()` resolves Promise
- Modal is removed automatically

---

## ModalProvider

### Custom Dismiss Behavior

- `show()` updates provider state
- Provider renders modal dynamically
- Modal resolves Promise on close
- Provider removes modal automatically

---


## ImperativeModal

- `show()` sets modal visible
- Internal Promise is created
- Modal resolves Promise on close
- Visibility resets automatically

---

# Architecture Comparison

| Feature | `modal.add()` | `ModalProvider` | `ImperativeModal` |
|---|---|---|---|
| Global state | ✅ | ❌ | ❌ |
| Context-based | ❌ | ✅ | ❌ |
| Ref-based | ❌ | ❌ | ✅ |
| Scoped modals | ❌ | ✅ | ✅ |
| Requires Provider | ❌ | ✅ | ❌ |
| Requires Container | ✅ | ❌ | ❌ |
| Best for app-wide dialogs | ✅ | ✅ | ❌ |
| Best for feature modules | ❌ | ✅ | ✅ |

---

# Best Practices

- Keep modal components reusable
- Use typed modal responses
- Use `outDelay` for animations
- Prefer `ModalProvider` for feature modules
- Prefer `modal.add()` for global confirms
- Prefer `ImperativeModal` for local workflows
- Keep modal UI separated from business logic

---

# Example With MUI

```tsx
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from "@mui/material";

import type {
  AsyncModalProps
} from "@paratco/async-modal";

type Response = boolean;

type Data = {
  title: string;
};

export function MuiConfirmModal(
  props: AsyncModalProps<Response, Data>
) {
  const {
    isVisible,
    data,
    onClose
  } = props;

  return (
    <Dialog
      open={isVisible}
      onClose={() => {
        onClose(false);
      }}
    >
      <DialogTitle>
        {data?.title}
      </DialogTitle>

      <DialogActions>
        <Button
          onClick={() => {
            onClose(false);
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={() => {
            onClose(true);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```