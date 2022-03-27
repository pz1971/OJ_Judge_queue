#include <iostream>
using   namespace  std ;

long long ar[1000005];

int main()
{

    int test_cases ;
    cin >> test_cases ;
    
    for(int tc = 1 ; tc <= test_cases ; tc++)
    {
        int a, b ;
        cin >> a >> b ;
        ar[tc] = a + b ;
    }

    for(int tc = 1 ; tc <= test_cases ; tc++)
        cout << ar[tc] << endl ;

    return 0;
}