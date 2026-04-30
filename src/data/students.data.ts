export type StudentRecord = {
  id: string;
  name: string;
  email: string;
  major?: string;
};

export const studentsData: StudentRecord[] = [
  { id: "stu_1", name: "Alex Kim", email: "alex.kim@hawk.illinoistech.edu", major: "CS" },
  { id: "stu_2", name: "Priya Shah", email: "priya.shah@hawk.illinoistech.edu", major: "ITM" },
  { id: "stu_3", name: "Jordan Lee", email: "jordan.lee@hawk.illinoistech.edu", major: "ECE" },
];
