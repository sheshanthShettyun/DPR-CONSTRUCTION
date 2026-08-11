export interface Stage {
  label: string;
  time: string;
  done: boolean;
  active?: boolean;
}

export interface OrderData {
  id: string;
  from: string;
  to: string;
  flag: string;
  sub: string;
  load: string;
  status: string;
  color: string;
  eta: string;
  distance: string;
  stages: Stage[];
}
