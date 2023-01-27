import { IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';

export function Toolbar() {
  return (
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton />
      </IonButtons>
      <IonTitle>Graph Viewer</IonTitle>
    </IonToolbar>
  );
}
