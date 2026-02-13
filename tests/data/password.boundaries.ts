export type PasswordBoundaryCase = {
  password: string;
  shouldPass: boolean;
};

export const PASSWORD_BOUNDARY_CASES: PasswordBoundaryCase[] = [
  { password: "123", shouldPass: false }, // 3
  { password: "1234", shouldPass: true }, // 4
  { password: "a".repeat(20), shouldPass: true }, // 20
  { password: "a".repeat(21), shouldPass: false }, // 21
];
