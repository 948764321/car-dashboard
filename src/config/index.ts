import { DashboardGearEnum } from '@/enums/dashboardEnum';

/**
 * 模拟暴力驾驶
 * 给油时
 *   转速表快速上升到当前档位最大转速；
 *   迈速表缓慢上升到当前档位最大速度；
 *   档位切换，周而复始；
 *
 * 松油时
 *   转速表快速下降到当前档位最低转速；
 *   迈速表缓慢下降到当前档位最低迈速；
 *   档位切换，周而复始；
 */

// 档位、转速、车速对应配置
export const GearSpeedConfig = [
	{
		gear: DashboardGearEnum.gearOne,
		minRpm: 0.8,
		maxRpm: 5,
		minSpeed: 0,
		maxSpeed: 20
	},
	{
		gear: DashboardGearEnum.gearTwo,
		minRpm: 1,
		maxRpm: 6,
		minSpeed: 20,
		maxSpeed: 30
	},
	{
		gear: DashboardGearEnum.gearThree,
		minRpm: 1.2,
		maxRpm: 6.4,
		minSpeed: 30,
		maxSpeed: 40
	},
	{
		gear: DashboardGearEnum.gearFour,
		minRpm: 1.4,
		maxRpm: 7,
		minSpeed: 40,
		maxSpeed: 60
	},
	{
		gear: DashboardGearEnum.gearFive,
		minRpm: 1.8,
		maxRpm: 7.6,
		minSpeed: 60,
		maxSpeed: 100
	},
	{
		gear: DashboardGearEnum.gearSix,
		minRpm: 2.2,
		maxRpm: 7,
		minSpeed: 100,
		maxSpeed: 120
	},
	{
		gear: DashboardGearEnum.gearSeven,
		minRpm: 3,
		maxRpm: 7,
		minSpeed: 120,
		maxSpeed: 180
	},
	{
		gear: DashboardGearEnum.gearEight,
		minRpm: 4,
		maxRpm: 7.6,
		minSpeed: 180,
		maxSpeed: 290
	}
];
