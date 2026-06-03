export const AUTH = {
  BASE: "/auth",
  login() {
    return `${this.BASE}/login/`;
  },
  register() {
    return `${this.BASE}/register/`;
  },
  forgotPassword() {
    return `${this.BASE}/password/reset/`;
  },
  updatePassword() {
    return `${this.BASE}/password/change/`;
  },
  getAccount() {
    return `${this.BASE}/me/`;
  },
  logout() {
    return `${this.BASE}/logout/`;
  },
  resetPassword(uuid: string, token: string) {
    return `${this.BASE}/resetpassword/${uuid}/${token}/`;
  },
  updateAccountInformation() {
    return `${this.BASE}/me/update/`;
  },
  updatePersonalInformation() {
    return `${this.BASE}/account/`;
  },
  getAllUsers() {
    return `${this.BASE}/all/`;
  },
  getAllUsersWithPK() {
    return `${this.BASE}/all-users/`;
  },
  getAllSectors() {
    return `${this.BASE}/sectors/`;
  },
  addNewUser() {
    return `${this.BASE}/registration/`;
  },
  resendVerificationEmail() {
    return `${this.BASE}/registration/resend-email/`;
  },
  verifyEmail() {
    return `${this.BASE}/registration/verify-email/`;
  },
};

export const ROLE_TYPE = {
  BASE: "/auth/role-types",
  getAll() {
    return `${this.BASE}/`;
  },
  createNew() {
    return `${this.BASE}/`;
  },
  getById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  updateById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  deleteById(id: string) {
    return `${this.BASE}/${id}/`;
  },
};

export const USER_IDENTITY = {
  BASE: "/auth/user-identity",
  getAll() {
    return `${this.BASE}/`;
  },
  createNew() {
    return `${this.BASE}/`;
  },
  getById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  updateById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  deleteById(id: string) {
    return `${this.BASE}/${id}/`;
  },
};

export const ROLE = {
  BASE: "/auth/roles",
  getAll() {
    return `${this.BASE}/`;
  },
  createNew() {
    return `${this.BASE}/`;
  },
  getById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  updateById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  deleteById(id: string) {
    return `${this.BASE}/${id}/`;
  },
};

export const VENDOR = {
  BASE: "/governance/vendor",
  getAll() {
    return `${this.BASE}/`;
  },
  createNew() {
    return `${this.BASE}/`;
  },
  getById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  updateById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  deleteById(id: string) {
    return `${this.BASE}/${id}/`;
  },
};

export const QUESTIONNAIRE = {
  BASE: "/governance/questionnaire",
  getAll() {
    return `${this.BASE}/`;
  },
  createNew() {
    return `${this.BASE}/`;
  },
  getById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  updateById(id: string) {
    return `${this.BASE}/${id}/`;
  },
  deleteById(id: string) {
    return `${this.BASE}/${id}/`;
  },
};

export const PERMISSION = {
  BASE: "/auth/permissions",
  getAll() {
    return `${this.BASE}/`;
  },
  createNew() {
    return `${this.BASE}/`;
  },
  getById(id: number) {
    return `${this.BASE}/${id}/`;
  },
  updateById(id: number) {
    return `${this.BASE}/${id}/`;
  },
  deleteById(id: number) {
    return `${this.BASE}/${id}/`;
  },
};
