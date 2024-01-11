import { GearSpeedConfig } from '@/config';
import { DashboardGearEnum } from '@/enums/dashboardEnum';
import { useEffect, useReducer, useRef } from 'react';
import RpmGauge from './components/rpm-gauge';
import SpeedGauge from './components/speed-gauge';
import './index.scss';
import { ActionType, GearSpeedState, gearSpeedReducer, gearSpeedState } from './reducers/gearSpeed';
import useSounds from '@/hooks/useSounds';

// 档位顺序列表
const gearOrderList = [
	DashboardGearEnum.gearOne,
	DashboardGearEnum.gearTwo,
	DashboardGearEnum.gearThree,
	DashboardGearEnum.gearFour,
	DashboardGearEnum.gearFive,
	DashboardGearEnum.gearSix,
	DashboardGearEnum.gearSeven,
	DashboardGearEnum.gearEight
];

const Dashboard = () => {
	// 是否给油
	const accRef = useRef(false);
	const [gearSpeedStatus, dph] = useReducer(gearSpeedReducer, gearSpeedState);
	const { playSound, stopSound } = useSounds();

	/** 封装 dispatch，用来获取最新 state */
	const dispatch = (state: GearSpeedState, action: ActionType) => {
		dph(action);
		return gearSpeedReducer(state, action);
	};

	// 监听外部事件
	useEffect(() => {
		const keyDownListener = (e: KeyboardEvent) => {
			if (e instanceof KeyboardEvent && e.key !== 'ArrowUp') return;
			accRef.current = true;
			playSound('drive');
			playSound('catapult');
		};
		const keyUpListener = (e: KeyboardEvent) => {
			if (e instanceof KeyboardEvent && e.key !== 'ArrowUp') return;
			accRef.current = false;
			stopSound('catapult');
		};

		document.addEventListener('keyup', keyUpListener);
		document.addEventListener('keydown', keyDownListener);

		return () => {
			document.removeEventListener('keyup', keyUpListener);
			document.removeEventListener('keydown', keyDownListener);
		};
	}, []);

	useEffect(() => {
		let requestId: number | null = null;

		const _handleAcc = (state: GearSpeedState) => {
			let newState: GearSpeedState = state;
			const currentRange = GearSpeedConfig.find(item => newState.gear === item.gear);

			if (!currentRange) throw Error('空挡，档位设计不合理');

			if (accRef.current) {
				if (newState.rpm < currentRange.maxRpm) {
					// 转速 +
					const rpmAction = { type: 'SET_RPM', rpm: newState.rpm + 0.25 } as const;
					newState = dispatch(newState, rpmAction);
				}
				if (newState.speed < currentRange.maxSpeed) {
					// 迈速 +
					const speedAction = { type: 'SET_SPEED', speed: newState.speed + 0.5 } as const;
					newState = dispatch(newState, speedAction);
				}

				if (newState.speed >= currentRange.maxSpeed) {
					// 超过当前档位速度，档位 +
					const gearIndex = gearOrderList.findIndex(item => item === currentRange.gear);
					const changeGear = gearIndex < gearOrderList.length - 1;
					const gearAction = { type: 'SET_GEAR', gear: gearOrderList[gearIndex + 1] } as const;
					if (changeGear) {
						newState = dispatch(newState, gearAction);
					}
				}
			} else {
				if (newState.rpm > currentRange.minRpm) {
					// 转速 -
					const rpmAction = { type: 'SET_RPM', rpm: Math.max(newState.rpm - 0.2, 0) } as const;
					newState = dispatch(newState, rpmAction);
				}
				if (newState.speed > currentRange.minSpeed) {
					// 迈速 -
					const speedAction = { type: 'SET_SPEED', speed: Math.max(newState.speed - 1.5, 0) } as const;
					newState = dispatch(newState, speedAction);
				}
				if (newState.speed <= currentRange.minSpeed) {
					// 低于当前档位速度，档位 -
					const gearIndex = gearOrderList.findIndex(item => item === currentRange.gear);
					const changeGear = gearIndex > 0;
					const gearAction = { type: 'SET_GEAR', gear: gearOrderList[gearIndex - 1] } as const;
					if (changeGear) {
						newState = dispatch(newState, gearAction);
					}
				}
			}
			requestId = requestAnimationFrame(() => _handleAcc(newState));
		};

		_handleAcc(gearSpeedState);

		return () => {
			requestId && cancelAnimationFrame(requestId);
		};
	}, []);

	return (
		<div className='dashboard'>
			<RpmGauge rpm={gearSpeedStatus.rpm} gear={gearSpeedStatus.gear} />
			<SpeedGauge speed={gearSpeedStatus.speed} />
		</div>
	);
};

export default Dashboard;
