import sys, getopt

from librosa import load as load_audio
from librosa.onset import onset_detect
from numpy import savetxt
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt

def gen_plot(y, sr, hop_length, loc, **kwargs):
    o_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop_length)
    times = librosa.times_like(o_env, sr=sr)
    onset_frames = librosa.onset.onset_detect(onset_envelope=o_env, sr=sr,
                                              hop_length=hop_length, **kwargs)

    D = np.abs(librosa.stft(y))
    plt.figure()
    ax1 = plt.subplot(2,1,1)
    librosa.display.specshow(librosa.amplitude_to_db(D, ref=np.max), x_axis='time', y_axis='log')
    plt.title('Power spectrogram')
    plt.subplot(2,1,2,sharex=ax1)
    plt.plot(times, o_env, label='Onset strength')
    plt.vlines(times[onset_frames], 0, o_env.max(), color='r', alpha=0.9, linestyle='--', label='Onsets')
    plt.axis('tight')
    plt.legend(frameon=True, framealpha=0.75)

    plt.savefig(loc)

# See https://librosa.org/librosa/generated/librosa.onset.onset_detect.html
def get_onsets(filePath):

    values, sample_rate = load_audio(filePath)
    # peak_pick parameters: pre_max, post_max, pre_avg, post_avg, delta, wait.
    # peak_pick details:
    # A sample n is selected as an peak if the corresponding x[n] fulfills the following three conditions:
    # x[n] == max(x[n - pre_max:n + post_max])
    # x[n] >= mean(x[n - pre_avg:n + post_avg]) + delta
    # n - previous_n > wait
    # where previous_n is the last sample picked as a peak (greedily).

    hop_length = 512 # default hop length is 512
    pre_max = (sample_rate * 0.03) // hop_length
    post_max = (sample_rate * 0.00) // hop_length + 1
    pre_avg = (sample_rate * 0.10) // hop_length
    post_avg = (sample_rate * 0.10) // hop_length + 1
    wait = (sample_rate * 0.03) // hop_length
    delta = 0.07
    onset_times = onset_detect(y=values, sr=sample_rate, hop_length=hop_length, units="time",
                               pre_max=pre_max,
                               post_max=post_max,
                               pre_avg=pre_avg,
                               post_avg=post_avg,
                               wait=wait,
                               delta=delta
                               )
    gen_plot(y=values, sr=sample_rate, hop_length=hop_length, loc="crepe/genplot.png",
             pre_max=pre_max,
             post_max=post_max,
             pre_avg=pre_avg,
             post_avg=post_avg,
             wait=wait,
             delta=delta
             )


    return onset_times


if __name__ == "__main__":
    helptext = "Usage: onset_detect.py -i <inputfile> -o <outputfile>. <inputfile> and <outputfile> are required."
    inputfile = ""
    outputfile = ""
    try:
        opts, args = getopt.getopt(sys.argv[1:], "hi:o:", ["help", "input=", "output="])
    except getopt.GetOptError:
        print(helptext)
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-h", "--help"):
            print(helptext)
            sys.exit()
        elif opt in ("-i", "--input"):
            inputfile = arg
        elif opt in ("-o", "--output"):
            outputfile = arg

    if not inputfile or not outputfile:
        print(helptext)
        sys.exit(2)

    times = get_onsets(inputfile)

    # write calculated values as CSV in the same format that CREPE uses
    savetxt(outputfile, times, fmt=['%.6f'], delimiter=',',
            header='time', comments='')
