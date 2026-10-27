import { ArchiveProject } from '../types/archive';

export const SAMPLE_ARCHIVES: ArchiveProject[] = [
  {
    id: 'phantasm-1999',
    name: 'Phantasm Daemon',
    subtitle: 'Decentralized P2P Hypermedia Network & Shadow Sockets',
    version: '0.9.4b',
    year: 1999,
    maintainer: 'alchemist_99 (Anonymous)',
    status: 'abandoned',
    lastActive: 'October 31, 2002',
    license: 'Artistic License 1.0 (Deprecated)',
    primaryLanguage: 'C / Perl 5',
    summary:
      'An early peer-to-peer hypermedia routing daemon authored before Napster was litigated. Designed to distribute un-censorable documents across rotating TCP sockets with an immutable cryptographic gossip graph.',
    image: '/src/assets/images/codex_phantasm_blueprint_1793115833446.jpg',
    tags: ['Peer-to-Peer', 'C99', 'Perl 5', 'Crypto Handshake', 'Pre-Gnutella', 'Dark Web Precursor'],
    stats: {
      fileCount: 4,
      totalLines: 780,
      obsoleteDeps: ['XOR-CBC Handshake', 'MD5 Checksums', 'sys/socket.h with select()', 'Perl 5.005 IPC::Open3'],
      riskScore: 'Critical',
      mysteryLevel: 'The maintainer vanished on Halloween 2002 after releasing RFC-007.',
    },
    files: [
      {
        filename: 'README.txt',
        title: 'Project Overview & Compilation Rituals',
        language: 'plaintext',
        lineCount: 165,
        content: `========================================================================
PHANTASM DAEMON (v0.9.4b) - "The Memex of Shadows"
Author: <alchemist_99@shadow-relay.net> (PGP Key ID: 0x9F4C20A1)
Date: Samhain Night, 1999
Status: BETA - RUN AT THY OWN PERIL
========================================================================

"The Web is falling into the hands of advertising cartels and domain registrars.
A link severed by an expired fee is an intellectual crime.
Phantasm ensures that when a server rots, its ghost wanders the peer swarm forever."

1. ARCHITECTURAL AXIOMS
-----------------------
Phantasm is an asynchronous daemon that listens on TCP port 7799.
Unlike HTTP servers that terminate at a single static IP address, every Phantasm node:
- Maintains a local ring of 32 neighbor sockets discovered through UDP broadcast.
- Replicates document fragments split across 4KB binary blocks.
- Verifies document integrity using MD5 hashes computed across each block.
- Implements the "Shadow Fallback" protocol: if a connection is stalled for 3.0s,
  the socket is forcefully dropped via SIGPIPE handler and traffic rerouted.

2. COMPILATION INSTRUCTIONS
----------------------------
Requires GCC 2.95.2 or later with libc5 / glibc 2.1.
To compile on FreeBSD 3.4 or Linux 2.2.14:

    $ gcc -O2 -Wall -D_GNU_SOURCE -o phantasm_daemon phantasm_daemon.c -lpthread
    $ perl -MCPAN -e 'install Digest::MD5'
    $ ./phantasm_daemon --port 7799 --shadow-seed 192.168.1.100

3. OBSOLETE DEPENDENCIES & KNOWN CAVEATS
-----------------------------------------
[EVIDENCE RECORD]
- Warning: parse_header_packet() utilizes a static buffer of 512 bytes with strcpy().
  An oversized peer handshake will overflow the frame stack.
- Cryptography uses raw XOR-CBC with an 8-byte salt derived from /dev/urandom.
  This is cryptographically broken under modern differential cryptanalysis.
- Socket polling relies entirely on select(2) with FD_SETSIZE fixed at 1024.
  High load will trigger kernel SIGSEGV if file descriptors exceed 1024.

4. LAST TRANSMISSION
--------------------
"If you are reading this after 2002: they have shut down the university relay.
Do not trust any binaries signed after October 31, 2002.
Keep the flame lit in the shadow nodes."
`,
      },
      {
        filename: 'RFC-001-SHADOW-PROTOCOL.md',
        title: 'RFC-001: Shadow Peer Topology & Handshake',
        language: 'markdown',
        lineCount: 220,
        content: `# RFC-001: THE SHADOW TOPOLOGY SPECIFICATION
Date: 14 December 1999
Author: alchemist_99
Archive Reference: ACC-1999-PHAN-001

## Abstract
This document formalizes the wire protocol for Phantasm nodes.
Before Chord or Kademlia were formalized, Phantasm established a deterministic pseudo-DHT
based on Euclidean distance between MD5 document hashes and node IDs.

## Packet Anatomy (Binary Header)
All frames sent over TCP/UDP must conform to the 16-byte fixed header:

\`\`\`
0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|   MAGIC (0x50 0x48 0x4E 0x54) | PROTO_VER (0x01) | FLAGS (8b)  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      PEER_ID_HIGH (32b)                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      PEER_ID_LOW (32b)                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|      PAYLOAD_LEN (16b)        |       CHECKSUM_CRC16 (16b)    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
\`\`\`

## Node Discovery
When a node awakens in the void:
1. It broadcasts a UDP beacon on port 7799 with the payload "PHANTASM_AWAKEN".
2. Any listening peer returns a list of up to 8 active peers.
3. If no UDP reply arrives in 1500ms, the node falls back to hardcoded DNS seeds
   (e.g., \`relay.shadow-net.org\` - Note: this domain was auctioned away in 2005).

## The Vanishing Node Paradox
What happens when a node abruptly terminates without sending \`GHOST_FIN\`?
Nodes retain tombstone records for 86,400 seconds. After that, data held solely
by that peer is considered submerged in the dark sea.
`,
      },
      {
        filename: 'DESIGN_PHILOSOPHY.md',
        title: 'The Memex of Shadows: Philosophical Manifesto',
        language: 'markdown',
        lineCount: 185,
        content: `# THE MEMEX OF SHADOWS
## A Treatise on Ephemeral Networks and Permanent Thought
Autumn 1999, Midnight

We were promised the Library of Alexandria in the sky.
Instead, we are getting a suburban strip mall governed by ICANN and AOL.
Every week, personal homepages vanish when free hosting services purge student accounts.
Geocities will one day be wiped clean, and millions of thoughts will dissolve into digital dust.

### Axiom I: Data Must Exist As An Ambient Ghost
Data should not live on a disk at a physical postal address.
Data must float across the network like heat in a room.
If ten people read an article, those ten people's machines should collectively murmur
the text to anyone else who seeks it.

### Axiom II: Zero Central Authority
There shall be no master server, no central directory, and no login credentials.
Your identity in Phantasm is simply your 64-bit ephemeral node ID, recycled every solstice.

### Axiom III: The Code Must Be Small Enough To Fit On A Floppy
If a system requires 100 megabytes of libraries to execute, it is already dead.
A true daemon must compile in under 10 seconds on a Pentium 133 with 32MB of RAM.
`,
      },
      {
        filename: 'daemon_core.c',
        title: 'daemon_core.c (Excerpt of Socket Dispatcher)',
        language: 'c',
        lineCount: 210,
        content: `/*
 * daemon_core.c - Phantasm Main Loop
 * Copyright (c) 1999 alchemist_99. Artistic License 1.0.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <signal.h>

#define PHANTASM_PORT 7799
#define BUFFER_SIZE 512 /* OBSOLETE: prone to stack smashing */

static volatile int g_ghost_running = 1;

void sig_reaper(int sig) {
    /* Zombie socket cleanup */
    printf("[GHOST] Received signal %d, dispersing shadow connections...\\n", sig);
    g_ghost_running = 0;
}

int handle_peer_handshake(int client_fd) {
    char header_buf[BUFFER_SIZE];
    ssize_t bytes_read;

    /* SECURITY FLAW: No bounds checking on incoming frame length */
    bytes_read = recv(client_fd, header_buf, BUFFER_SIZE - 1, 0);
    if (bytes_read <= 0) {
        close(client_fd);
        return -1;
    }

    header_buf[bytes_read] = '\\0';
    if (strncmp(header_buf, "PHNT", 4) != 0) {
        printf("[WARN] Alien packet received. Dropping socket.\\n");
        close(client_fd);
        return -2;
    }

    printf("[RESONANCE] Handshake verified for peer. Exchanging shadow tables.\\n");
    /* TODO: Implement mutual TLS - (Written 1999, never implemented) */
    return 0;
}
`,
      },
    ],
  },
  {
    id: 'aethernet-2004',
    name: 'AetherNet Crawler',
    subtitle: 'Distributed Topical Web Crawler & Semantic Graph Indexer',
    version: '1.2.0-rc3',
    year: 2004,
    maintainer: 'A. Jenkins / SIG-RCD Research Group',
    status: 'archived',
    lastActive: 'September 22, 2004',
    license: 'GPL-2.0-only',
    primaryLanguage: 'Python 2.2 / C Extensions',
    summary:
      'An academic research crawler built in early Python 2 to map the non-commercial web using semantic vector space similarity rather than PageRank link-farming.',
    image: '/src/assets/images/codex_aethernet_manifesto_1793115834764.jpg',
    tags: ['Web Crawler', 'Python 2.2', 'Semantic Clustering', 'Vector Space', 'Pre-Google Monopoly', 'Academic'],
    stats: {
      fileCount: 3,
      totalLines: 640,
      obsoleteDeps: ['Python 2.2 urllib / htmllib', 'Berkeley DB (bsddb)', 'libxml2 legacy bindings', 'No TLS 1.3 / HTTP/2'],
      riskScore: 'High',
      mysteryLevel: 'The research lab was reorganized and funding transferred to DoD surveillance grants in 2005.',
    },
    files: [
      {
        filename: 'README.md',
        title: 'Project Overview & Architectural Pipeline',
        language: 'markdown',
        lineCount: 190,
        content: `# AetherNet Semantic Web Crawler (2004)
**Author**: Dr. Arthur Jenkins (<ajenkins@sig-rcd.ac.uk>)
**Archive Accession**: ACC.2004-1108
**Processed**: 22 September 2004

## Purpose
AetherNet was built to counter the emerging commercial search monopolies of 2003-2004.
Instead of ranking pages by raw inbound link spam or advertising budgets,
AetherNet navigates hyperlinks based on *thematic affinity* using a TF-IDF cosine vector model.

## Core Architectural Components
1. **Frontier Manager**: A priority queue backed by Berkeley DB (bsddb3).
   Assigns crawl priority based on proximity to the user's seed ontology.
2. **Politeness Engine**: Enforces strict 5-second delays per host IP to respect student webmasters.
3. **C Tokenizer Extension (fast_tokenize.c)**: Accelerated word n-gram extraction
   compiled against the Python 2.2 C API.
4. **Vector Clustering Engine**: Clusters downloaded HTML documents into 64-dimensional topic spaces.

## Obsolete Systems & Environmental Breakage
- Written for Python 2.2. Standard library \`htmllib.HTMLParser\` and \`urllib.urlopen\`
  fail on modern HTTPS connections (SNI was not supported in Python 2.2).
- Relies on \`bsddb.hashopen()\`, which was deprecated in Python 2.7 and removed in Python 3.
- No support for JavaScript DOM rendering. Modern single-page applications appear as blank pages.
`,
      },
      {
        filename: 'MANIFESTO.txt',
        title: 'Foundations for a New Digital Discipline (June 18, 2004)',
        language: 'plaintext',
        lineCount: 140,
        content: `THE ENGINEERING MANIFESTO
Foundations for a New Digital Discipline - June 18, 2004
A. Jenkins, Lead Engineer / SIG-RCD

1. PREAMBLE: Engineering must prioritize functional simplicity and systemic resilience.
   We reject commercial obfuscation.
2. DISCIPLINE: Design with intent. Architecture should adhere strictly to specification;
   deviation is a failure of constraint.
3. ETHOS: Technology serves humanity; we do not build for the machine,
   but for the user within the machine.
4. PARADIGMS: Systems must be modular, repairable, and documented without assumption of prior knowledge.
5. LEGACY: We build with awareness of the past. Current complexity is a debt we must repay.

The Web should remain an open text commons. When three private corporations control
every entry gate to human knowledge, knowledge itself becomes a proprietary commodity.
We release AetherNet to anyone with a dialup or DSL connection and a curious mind.
`,
      },
      {
        filename: 'crawler_frontier.py',
        title: 'crawler_frontier.py (Python 2 Archive Excerpt)',
        language: 'python',
        lineCount: 180,
        content: `#!/usr/bin/env python
# -*- coding: iso-8859-1 -*-
"""
crawler_frontier.py - Berkeley DB persistent frontier for AetherNet
Target: Python 2.2 / 2.3
"""
import bsddb
import urlparse
import time

class PersistentFrontier:
    def __init__(self, db_path="frontier.db"):
        # OBSOLETE: bsddb has been obsolete for 15+ years
        self.db = bsddb.hashopen(db_path, 'c')
        self.visited = {}

    def push_url(self, raw_url, priority=1.0):
        # Flaw: No normalization for UTF-8 or IDN domain punycoding
        parsed = urlparse.urlparse(raw_url)
        if parsed[0] not in ('http', 'gopher'): # Yes, gopher was still indexed!
            return False

        host = parsed[1].lower()
        key = "%s:%s" % (host, parsed[2])
        if self.db.has_key(key):
            return False

        self.db[key] = str(priority)
        self.db.sync()
        return True

    def pop_next(self):
        # Linear iteration through hash DB (O(N) bottleneck)
        for k in self.db.keys():
            val = float(self.db[k])
            del self.db[k]
            return k, val
        return None, 0.0
`,
      },
    ],
  },
  {
    id: 'necro-os-2008',
    name: 'NecroOS Kernel Spec',
    subtitle: 'Capability-Based Microkernel with Deterministic Ghost Memory Recycling',
    version: '0.4.1-alpha',
    year: 2008,
    maintainer: 'The NecroOS Core Working Group (M. Thorne, V. Zhao)',
    status: 'dormant',
    lastActive: 'November 14, 2008',
    license: 'BSD-2-Clause',
    primaryLanguage: 'ANSI C / x86 Assembly',
    summary:
      'A research microkernel designed around an asynchronous "ghost thread" that sweeps dead memory pages deterministically without triggering garbage collection pauses or heap fragmentation.',
    image: '/src/assets/images/codex_necro_kernel_1793115834716.jpg',
    tags: ['Microkernel', 'x86 Assembly', 'Capability Security', 'OSDev', 'Zero-Copy IPC', 'Bare Metal'],
    stats: {
      fileCount: 3,
      totalLines: 820,
      obsoleteDeps: ['NASM 32-bit x86 syntax', 'Legacy PIC 8259 interrupt controller', 'No 64-bit long mode', 'No ACPI power management'],
      riskScore: 'Moderate',
      mysteryLevel: 'The lead kernel engineer was hired by a hypervisor vendor and code development halted.',
    },
    files: [
      {
        filename: 'README.md',
        title: 'Microkernel Architecture & Core Primitives',
        language: 'markdown',
        lineCount: 210,
        content: `# NecroOS Microkernel Specification (v0.4.1-alpha)
Maintainers: M. Thorne & V. Zhao (Cambridge OSDev Group)
Date: 14 November 2008

## The Problem with Monolithic Kernels
Operating systems like Linux have grown to tens of millions of lines of C.
A bug in an obscure camera driver can panic the entire machine.
NecroOS adheres to the strict L4 microkernel philosophy:
- The kernel runs in Ring 0 with fewer than 9,000 lines of verified ANSI C.
- Drivers (disk, keyboard, network) live as isolated userland tasks in Ring 3.
- Communication occurs strictly via synchronous Zero-Copy Message Passing (IPC).

## The "Ghost Reaper" Memory Concept
In traditional systems, when a process crashes, page table teardown can cause lock contention.
NecroOS introduces the \`GHOST_REAPER\` idle task (Task ID: 0x0001):
Whenever CPU utilization drops below 10%, the ghost reaper sweeps orphaned paging tables,
clearing the TLB cache without interrupting real-time audio or calculation threads.
`,
      },
      {
        filename: 'SPECIFICATION.md',
        title: 'Capability Token System & IPC Syscalls',
        language: 'markdown',
        lineCount: 260,
        content: `# NecroOS IPC & Capability Tokens
Accession: ACC.2008-NECRO-04

## The Capability Model
Every object in NecroOS (a memory page, an IPC endpoint, an I/O port) is referenced
via an unforgeable 64-bit capability token:
- Bits 63..48: Generation Counter (protects against use-after-free)
- Bits 47..16: Object Kernel Pointer (scrambled with XOR session key)
- Bits 15..0: Permission Bitmask (READ=0x1, WRITE=0x2, GRANT=0x4, REVOKE=0x8)

## Hardware Limitations (2008 State)
- Requires an x86 CPU with Pentium II \`SYSENTER\` / \`SYSEXIT\` support.
- Hardcoded for 32-bit memory (maximum addressable space: 4GB without PAE).
- Modern x86-64 long mode, UEFI boot, and ARM64 / RISC-V architectures are completely unsupported.
`,
      },
      {
        filename: 'ghost_reaper.c',
        title: 'ghost_reaper.c (Kernel Memory Collector Excerpt)',
        language: 'c',
        lineCount: 190,
        content: `/*
 * necro_kernel/ghost_reaper.c
 * Sweeps orphaned process frames during idle cycles.
 */
#include "kernel.h"

void ghost_reaper_loop(void) {
    kprintf("[REAPER] Ghost thread initialized on CPU 0.\\n");

    while (1) {
        /* Sleep until woke by kernel scheduler or idle tick */
        hal_cpu_halt_until_interrupt();

        if (g_zombie_process_queue.count > 0) {
            spin_lock(&g_zombie_process_queue.lock);
            task_t *zombie = dequeue_zombie();
            spin_unlock(&g_zombie_process_queue.lock);

            if (zombie) {
                kprintf("[REAPER] Dissolving dead process PID: %d, pages: %d\\n",
                        zombie->pid, zombie->allocated_pages);
                free_page_directory(zombie->page_dir_physical);
                kfree(zombie);
            }
        }
    }
}
`,
      },
    ],
  },
  {
    id: 'chronosdb-2011',
    name: 'ChronosDB',
    subtitle: 'Immutable Append-Only Time-Series Engine with Gossip Replication',
    version: '0.8.2',
    year: 2011,
    maintainer: 'S. Lindqvist (Stockholm)',
    status: 'abandoned',
    lastActive: 'March 15, 2011',
    license: 'Apache-2.0',
    primaryLanguage: 'Erlang/OTP R14B',
    summary:
      'An immutable distributed time-series database written in Erlang. Forewent B-trees for append-only columnar chunk files with monotonic timestamps and gossip consensus.',
    image: '/src/assets/images/codex_phantasm_blueprint_1793115833446.jpg',
    tags: ['Database', 'Erlang/OTP', 'Time-Series', 'Append-Only', 'Byzantine Gossip', 'IoT Precursor'],
    stats: {
      fileCount: 3,
      totalLines: 590,
      obsoleteDeps: ['Erlang/OTP R14B runtime syntax', 'No Raft consensus', 'Custom uncompressed binary chunk format'],
      riskScore: 'Moderate',
      mysteryLevel: 'Abruptly abandoned when maintainer left for an autonomous vehicle startup in Germany.',
    },
    files: [
      {
        filename: 'README.md',
        title: 'Overview & The Monotonic Time Philosophy',
        language: 'markdown',
        lineCount: 180,
        content: `# ChronosDB: The Clockwork Storage Engine (2011)
Author: Stefan Lindqvist
License: Apache-2.0

## Philosophy: Time as a Monotonic Spiral
Most relational databases treat time as an arbitrary column: \`created_at TIMESTAMP\`.
They permit updates, deletions, and backfilled timestamps.
In ChronosDB, **time is immutable physics**.
You can never update an existing metric. If a sensor reports a wrong value,
you can only append a compensating anti-record at $T + \\Delta t$.

## Erlang Architecture
- Each metric stream is an Erlang \`gen_server\` actor.
- Disk writes are buffered in ETS tables and flushed to disk in 64MB sequential chunks.
- Fault tolerance is provided by OTP supervision trees. If a disk worker crashes due to I/O error,
  the supervisor restarts it without dropping inbound UDP sensor packets.
`,
      },
      {
        filename: 'DESIGN_NOTES.md',
        title: 'Design Decisions and Lost Roadmap',
        language: 'markdown',
        lineCount: 170,
        content: `# ChronosDB Design Rationale & Missing Roadmap

## 1. Why Erlang?
Because in 2011, handling 50,000 concurrent UDP connections in Python or Ruby was impossible.
Erlang lightweight processes let us spawn a worker for every remote weather station.

## 2. Unsolved Byzantine Gossip Problems
Our gossip replication protocol assumes well-behaved nodes.
If a malicious or clock-drifted node injects future timestamps (e.g., Year 2045),
the monotonic index breaks.
We designed a Byzantine Fault Tolerant filter in \`chronos_bft.erl\`,
but never finished it before the grant concluded in March 2011.
`,
      },
    ],
  },
];
