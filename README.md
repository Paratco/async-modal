# React Async Modal

This repository contains a custom React hook (useAsyncModal) and a modal context provider (AsyncModalProvider) for handling asynchronous modal dialogs in your React application.

## Table of Contents

- [Features](#features)
- [Container Modal Future](#--container-modal-future)
- [Provider Modal Future](#--provider-modal-future)
- [Imperative Modal Future](#--imperative-modal-future)
- [Installation](#installation)
- [Types Modal](#three-types-asyncmodal)
- [Usage Container Modal](#1-usage-container-modal)
- [Usage Provider Modal](#2-usage-provider-modal)
- [Usage Imperative Modal](#3-usage-imperative-modal)
- [Advanced Usage](#advanced-usage)

## Features
- Dynamic Data Passing: You can pass dynamic data to the modal and handle it in your component.
- Dismissible Modals: You can make modals dismissible or non-dismissible.
- Fully Typed: Typescript support is included to ensure type safety for modal props and returned values.
- we can have a Modal Component with three types for showing our modal.(`Container Modal` | `Provider Modal` | `Imperative Modal`)

### - `Container Modal` Future
- we have to imported `<ModalContainer />` in jsx part of the File.
- The `modal.show()` method returns a Promise that resolves when the modal is closed.
- using easily from our Modal component.

### - `Provider Modal` Future
- we have to put our App Component in the `<AsyncModalProvider>`.
- we can show our modal every where we want.
- The `show()` method returns a Promise that resolves when the modal is closed.

### - `Imperative Modal` Future
- this modal is like the Container modal.
- we have to imported `<ImperativeModal>` in my jsx part the file.
- and set a ref variable for this component with `ImperativeModalApi` type.
- The `show()` in _`ImperativeModalApi`_ type method returns a Promise that resolves when the modal is closed.

## Installation

To install, you can use npm or yarn or pnpm:

```js
npm install @paratco/async-modal

yarn add @paratco/async-modal

pnpm add @paratco/async-modal
```

## Three Types AsyncModal
1. Container modal
2. Imperative modal
3. Provider modal


### 1. Usage Container modal


  1. Create `MyModal` Component with `AsyncModalProps` Type
  - this sample has data:

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


  2. import `modal` from @paratco/async-modal in my Component that we want show Container modal in it.

      ```tsx
      import { modal } from "@paratco/async-modal";
      ```

  3. set handle showMyModal Function:
  - we use `modal.add()` for showing our modal

    ```tsx
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
    ```

  4. using from `ModalContainer` in our return Component:

      ```tsx
      <ModalContainer />
      <Button
        variant="text"
        onClick={() => {
          void showMyModal();
        }}
      >
        Show Modal Container
      </Button>
      ```

### 2. Usage Provider Modal:
  1. set up the `ModalProvider`:

      ```tsx
      import { ModalProvider } from "@paratco/async-modal";

      function App() {
        return <AsyncModalProvider>{/* Rest of your app */}</AsyncModalProvider>;
      }
      ```

  2. Create MyModal Component:

  - in this sample we have any data:
  - and for the type of our modalComponent we use from `AsyncModalProps`:

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
        onClose(true);
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
              This is Provider Modal
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

  3. using from `useProviderModal` Hook for show My modal:

      ```tsx
      import { useProviderModal } from "@paratco/async-modal";

      const { show } = useProviderModal();
      ```

  4. create `functionShow` and `button`:

      ```tsx
      const showMyModal = async (): Promise<void> => {
        const result = await show(
          MyModal
          , {
            dismissible: true
          }
        );

        console.log(`Provider Modal result: ${result}`);
      };

      <button
        type="button"
        onClick={() => {
          void showMyModal();
        }}
      >
        Show Provider Modal
      </button>
      ```

### 3. Usage Imperative Modal:

- in this Modal type, we use from `Ref`.
- type of this Ref is `ImperativeModalApi` that it's coming from `@paratco/async-modal`.

    ```tsx
    import type { ImperativeModalApi } from "@paratco/async-modal";

    const imperativeRef = useRef<ImperativeModalApi<Response, DataModal | null>>(null);
    ```

1. create `MyModal` Component:
- in this sample we have any data:

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
              This is Imperative Modal
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

2. Create `Ref` of Imperative modal for showing:
- we should use _`MyModal`_ component as type component:

    ```tsx
    import { useRef } from "react";
    import type { ImperativeModalRef } from "@paratco/async-modal";

    const imperativeRef = useRef<ImperativeModalRef<typeof MyModal>>(null);
    ```

3. set Function `showMyModal`:

    ```tsx
    const showMyModal = async (): Promise<void> => {
      const result = await imperativeRef.current?.api.show();

      console.log(`Imperative Modal result: ${result}`);
    };
    ```

4. in finally:

- we use `ImperativeModal` from `@paratco/async-modal`:
- and create a button for showing my modal:

  ```tsx
  <button
    type="button"
    onClick={() => {
      void showMyModal();
    }}
  >
    Show Modal Imperative
  </button>
  <ImperativeModal
    Modal={MyModal}
    dismissible={true}
    ref={imperativeRef}
  />
  ```


## Advanced Usage

### Handling Multiple Modals

The AsyncModalProvider can handle multiple modals across different components. Each modal will wait for the previous one to resolve before being displayed.

### Custom Dismiss Behavior

You can make modals unDismissible by setting dismissible to false. This prevents the modal from closing unless the user interacts with it.

  - in the `Container Modal`: 

    ```tsx
    const result = await modal.add(
      MyModal, 
      {
        dismissible: true  // Modal cannot be dismissed without action
      }
    );
    ```

  - in the `Provider Modal`:

    ```tsx
    const result = await show(
      MyModal, 
      {
        dismissible: true,  // Modal cannot be dismissed without action
      }
    );
    ```

  - in the `Imperative Modal`:

    ```tsx
    <ImperativeModal
      Modal={MyModal}
      dismissible={true}  // Modal cannot be dismissed without action
      ref={imperativeRef}
    />
    ```

### Passing Complex Data

You can pass any type of data to your modal. This can be useful for passing context, form data, or other inputs that need to be shown or processed inside the modal.

  - in the `Container Modal`: 

    ```tsx
    const result = await modal.add(ShowContainerModal, {
      data: {
        userId: "43",
        userName: "JohnDoe"
      },
      dismissible: true
    });
    ```

  - in the `Provider Modal`:

    ```tsx
    const result = await show(
      ShowProviderModal, {
        dismissible: true,
        data: {
          userId: "43",
          userName: "JohnDoe"
        }
      }
    );
    ```

  - in the `Imperative Modal`:

    ```tsx
    <ImperativeModal
      Modal={ShowImperativeModal}
      dismissible={true}
      ref={imperativeRef}
      data={{
        userId: "43",
        userName: "JohnDoe"
      }}
    />
    ```