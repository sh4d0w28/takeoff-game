
export class PlaneStateEnum {
    public static readonly OK = 'OK';
    public static readonly DEAD = 'DEAD';
    public static readonly TAKEOFF = 'TAKEOFF';
}

export class DirectionEnum {
    public static readonly UP = 'UP';
    public static readonly DOWN = 'DOWN';
    public static readonly RIGHT = 'RIGHT';
    public static readonly LEFT = 'LEFT';
}

export class PlaneColorEnum {
    public static readonly RED = 0;
    public static readonly GREEN = 1;
    public static readonly BLUE = 2;
    public static readonly PURPLE = 3;
    public static readonly PINK = 4;
    public static readonly WHITEBLUE = 5;

    public static list = [this.RED, this.GREEN, this.BLUE, this.PURPLE, this.PINK, this.WHITEBLUE];
}