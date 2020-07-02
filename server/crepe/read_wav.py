import sys, getopt

from scipy.io import wavfile
import numpy as np
from numpy.lib.stride_tricks import as_strided

def wav_to_csv(file):

    # Read input wave file sample rate and audio data
    try:
        sr, audio = wavfile.read(file)
    except ValueError:
        print("wav_to_csv: Could not read %s" % file, file=sys.stderr)
        raise

    center = True # center frames around intervals, rather than starting frames at intervals
    step_size = 10 # milliseconds; bucket size
    model_srate = 16000 # 16 kHz

    if len(audio.shape) == 2:  # if stereo
        audio = audio.mean(1)  # make mono
    audio = audio.astype(np.float32)
    if sr != model_srate:
        # resample audio if necessary
        from resampy import resample
        audio = resample(audio, sr, model_srate)

    samples_per_step = int(model_srate * step_size / 1000) # srate * step_size should be a multiple of 1000 for this to work correctly
    # zero-pad start of audio to ensure steps are centered around step_size intervals.
    if center:
        audio = np.pad(audio, (samples_per_step // 2, 0), mode="constant", constant_values=0)
    # zero-pad end of audio to ensure number of samples is divisible by samples_per_step
    # TODO: verify this results in the same number of steps as the CREPE output
    # TODO: fix this. it seems to result in 1 extra step, which is undesirable (though if this happens, we can remove one from the end).
    if len(audio) % samples_per_step != 0:
        amount_to_pad = samples_per_step - (len(audio) % samples_per_step)
        audio = np.pad(audio, (0, amount_to_pad), mode="constant", constant_values=0)

    # reshape to produce an array of arrays, with each sub-array being the samples for a step
    audio = np.reshape(audio, (-1, samples_per_step))
    # take absolute value of array (because we're looking for maximum amplitude, which can be positive or negative)
    audio = np.abs(audio)
    # calculate max value of region to get maximum amplitude, because we're looking for which steps had local-maximum
    # amplitude (i.e. which step was the note first played)
    step_max = np.amax(audio, axis=1)

    # generate timestamp data
    time = np.arange(step_max.shape[0]) * step_size / 1000.0

    return time, step_max


if __name__ == "__main__":
    helptext = "Usage: read_wav.py -i <inputfile> -o <outputfile>. <inputfile> is required."
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

    if not inputfile:
        print(helptext)
        sys.exit(2)

    time, max_amplitude = wav_to_csv(inputfile)

    # write calculated values as CSV in the same format that CREPE uses
    if not outputfile:
        outputfile = inputfile + ".csv"
    data = np.vstack([time, max_amplitude]).transpose()
    np.savetxt(outputfile, data, fmt=['%.3f', '%.6f'], delimiter=',',
               header='time,max_amplitude', comments='')
