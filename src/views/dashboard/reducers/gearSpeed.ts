import { DashboardGearEnum, DashboardRpmEnum } from '@/enums/dashboardEnum';
import produce from 'immer';

export interface GearSpeedState {
	rpm: number;
	gear: DashboardGearEnum;
	speed: number;
}

export const gearSpeedState: GearSpeedState = {
	rpm: DashboardRpmEnum.minRpm as number,
	gear: DashboardGearEnum.gearOne,
	speed: 0
};

export const gearSpeedReducer = (state: GearSpeedState, action: ActionType) =>
	produce(state, draftState => {
		switch (action.type) {
			case 'SET_RPM':
				draftState.rpm = action.rpm;
				break;
			case 'SET_GEAR':
				draftState.gear = action.gear;
				break;
			case 'SET_SPEED':
				draftState.speed = action.speed;
				break;
			case 'SET_ALL':
				Object.assign(draftState, action);
				break;
			default:
				return draftState;
		}
	});

export type ActionType = {
	[key in keyof GearSpeedState]?: any;
} & {
	type: 'SET_RPM' | 'SET_GEAR' | 'SET_SPEED' | 'SET_ALL';
};
