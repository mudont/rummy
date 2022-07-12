export interface DragItem {
  id: string;
  type: string;
  left: number;
  top: number;
  angle: number;
}
export interface UICard {
  top: number;
  left: number;
  z: number;
  title: string;
  angle: number;
  classes: string;
}
export interface BoxMap {
  [key: string]: UICard;
}
