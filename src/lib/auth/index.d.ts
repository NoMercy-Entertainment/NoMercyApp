
export interface TokenRequestData {
    grant_type: string;
    client_id : string;
    client_secret : string;
    redirect_uri: string;
    // code_verifier: string;
    code: string;
}
export interface RefreshTokenRequestData {
    grant_type: string;
    client_id : string;
    client_secret: string;
    refresh_token?: string;
}

export interface DeviceTokenRequestData {
    client_id : string;
}

export interface TokenResponse {
    id_token: string;
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}

export interface DeviceResponse {
    device_code: string;
    user_code: string;
    verification_uri: string;
    verification_uri_complete: string;
    expires_in: number;
    interval: number;
}

export interface IDToken {
    aud: string;
    iss: string;
    iat: number;
    exp: number;
    sub: string;
    name: string;
    preferred_username: string;
    display_name: string;
    locale: null | string;
    given_name: string;
    family_name: string;
    updated_at: string;
    email: string;
    email_verified: number;
}

export interface DecodedToken {
    [key: string]: any;
}


export interface RegistrationResponse {
    id:                         string;
    createdTimestamp:           number;
    username:                   string;
    enabled:                    boolean;
    totp:                       boolean;
    emailVerified:              boolean;
    firstName:                  string;
    lastName:                   string;
    email:                      string;
    attributes:                 Attributes;
    disableableCredentialTypes: any[];
    requiredActions:            any[];
    federatedIdentities:        any[];
    notBefore:                  number;
    access:                     Access;
}

export interface Access {
    manageGroupMembership: boolean;
    view:                  boolean;
    mapRoles:              boolean;
    impersonate:           boolean;
    manage:                boolean;
}

export interface Attributes {
    display_name: string[];
}
