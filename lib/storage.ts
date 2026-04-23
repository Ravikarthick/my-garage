import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'mygarage_v1';
export interface Car {
  id:string; brand:'hw'|'mb'; name:string; manufacturer:string;
  series:string; year:string; color:string; colnum:string; mainline:string;
  tampo:string; notes:string; th:'none'|'th'|'sth';
  status:'owned'|'wish'|'dup'; photo:string|null; added:number;
}
export const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
export const loadCars = async (): Promise<Car[]> => {
  try { const d = await AsyncStorage.getItem(KEY); return d ? JSON.parse(d) : []; } catch { return []; }
};
export const saveCars = async (cars:Car[]) => {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(cars)); } catch(e) { console.error(e); }
};
export const addCar = async (car:Car) => { const c=await loadCars(); const u=[car,...c]; await saveCars(u); return u; };
export const updateCar = async (car:Car) => { const c=await loadCars(); const u=c.map(x=>x.id===car.id?car:x); await saveCars(u); return u; };
export const deleteCar = async (id:string) => { const c=await loadCars(); const u=c.filter(x=>x.id!==id); await saveCars(u); return u; };
