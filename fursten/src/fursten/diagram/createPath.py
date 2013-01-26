'''
Created on 11 okt 2012

@author: Olof Manbo

Version: 1.0.0
'''


def d(X, Y):
    result = 'M %i %i '%(X[0], Y[0])
    for x,y in zip(X[1:], Y[1:]):
        result += "L %i %i "%(x, y)
    result += "L %i %i "%(X[0], Y[0])
    return result

def path(d, cssClass):
    return '<path id="mappath" d="%s" class=%s  fill-rule="evenodd" stroke="black" stroke-width="1" />'%(d, cssClass)


if __name__ == '__main__':
    d1 = d([100,200,200,100], [100,100,200,200])
    d2 = d([125,175,175,125], [125,125,175,175])
    print path(d1 + d2, "red")