#include <iostream>
using namespace std ;

int main()
{
    
    int test_cases ;
    cin >> test_cases ;
    
    for(int tc = 1 ; tc <= test_cases ; tc++)
    {
        int a, b;
        cin >> a >> b ;
        cout << a + b << endl ;
    }

    return 0;
}