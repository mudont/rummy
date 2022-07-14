export interface DragItem {
  id: string;
  type: string;
  left: number;
  top: number;
  angle: number;
  isHand: boolean;
}
export interface UICard {
  id: number;
  top: number;
  left: number;
  z: number;
  title: string;
  angle: number;
  classes: string;
  isHand: boolean;
  isDeck: boolean;
}
export interface BoxMap {
  [key: string]: UICard;
}
