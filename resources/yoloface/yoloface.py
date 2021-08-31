import time
import sys
for i in range(100):
    print('progress:%.2f' % ((i+1)/100))
    sys.stdout.flush()
    time.sleep(0.1)