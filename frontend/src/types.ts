export type LoginInputsType = {
  username: string;
  password: string;
};

export type SignupInputsType = {
  username: string;
  email: string;
  password: string;
};

export type VideoMetaDataType = {
  title: string;
  description: string;
};

export type AuthContextType = {
  userAuthenticated: boolean;
  setUserAuthenticated: (userAuthenticated: boolean) => void;
};
