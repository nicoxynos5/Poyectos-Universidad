#include "big_brother.h"
#include "fat_fuse_ops.h"
#include "fat_table.h"
#include "fat_util.h"
#include "fat_volume.h"
#include <stdio.h>
#include <string.h>

int bb_is_log_file_dentry(fat_dir_entry dir_entry) {
    return strncmp(LOG_FILE_BASENAME, (char *)(dir_entry->base_name), 3) == 0 &&
           strncmp(LOG_FILE_EXTENSION, (char *)(dir_entry->extension), 3) == 0;
}

int bb_is_log_filepath(char *filepath) {
    return strncmp(BB_LOG_FILE, filepath, 8) == 0;
}

int bb_is_log_dirpath(char *filepath) {
    return strncmp(BB_DIRNAME, filepath, 15) == 0;
}

/* Searches for a cluster that could correspond to the bb directory and returns
 * its index. If the cluster is not found, returns 0.
 */

u32 search_bb_orphan_dir_cluster() {
    u32 bb_dir_start_cluster = 0;
    u32 cur_cluster = 0;
    fat_volume vol = get_fat_volume();
    fat_table table = vol->table;
    u32 max_cluster = 10000;

    // recorremos todos los cluster hasta q lleguemos al ultimo o hasta q ya
    // encontremos al huerfano

    while (cur_cluster != max_cluster) {

        // encontramos un cluster BAD
        u32 cluster = ((const le32 *)table->fat_map)[cur_cluster];

        if (fat_table_cluster_is_bad_sector(cluster)) {
            fat_file file_mentira =
                fat_file_init_orphan_dir(BB_DIRNAME, vol->table, cur_cluster);
            GList *children_list = fat_file_read_children(file_mentira);

            fat_file *child = g_list_first(children_list)->data;

            printf("cluster huerfano %d\n", cur_cluster);

            if (!strncmp("log", (*child)->name, 3)) {
                bb_dir_start_cluster = cur_cluster;
                g_list_free(children_list);
                break;
            }
            g_list_free(children_list);
        }
        cur_cluster++;
    }

    return bb_dir_start_cluster;
}

/* Creates the /bb directory as an orphan and adds it to the file tree as
 * child of root dir.
 */
int bb_create_new_orphan_dir() {

    errno = 0;
    fat_volume vol = get_fat_volume();
    fat_table table = vol->table;
    u32 free_cluster = fat_table_get_next_free_cluster(table);

    fat_file loaded_bb_dir =
        fat_file_init_orphan_dir(BB_DIRNAME, vol->table, free_cluster);

    fat_table_set_next_cluster(table, free_cluster, FAT_CLUSTER_BAD_SECTOR);

    fat_tree_node root_node = fat_tree_node_search(vol->file_tree, "/");
    vol->file_tree = fat_tree_insert(vol->file_tree, root_node, loaded_bb_dir);

    return -errno;
}


//COMENTO LA FUNCIÓN PQ SIGO SIN ENTENDER LA DIFERENCIA ENTRE LA FUN DE ARRIBA Y ESTA

/* 
int bb_init_log_dir(u32 start_cluster) {
    errno = 0;
    fat_volume vol = NULL;
    fat_tree_node root_node = NULL;

    vol = get_fat_volume();

    // Create a new file from scratch, instead of using a direntry like normally
done. fat_file loaded_bb_dir = fat_file_init_orphan_dir(BB_DIRNAME, vol->table,
start_cluster);
    // Add directory to file tree. Its entries will be like any other dir.
    root_node = fat_tree_node_search(vol->file_tree, "/");
    vol->file_tree = fat_tree_insert(vol->file_tree, root_node, loaded_bb_dir);

    return -errno;
}
*/
